import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Author from "@/lib/models/Author";
import { getSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";

// PATCH /api/users/[id] — superadmin: update role / approve/reject/verify writer
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  await connectDB();
  const update: Record<string, unknown> = {};

  if (body.role) {
    update.role = body.role;
    // Align writerStatus with role changes
    if (body.role === "writer") {
      update.writerStatus = "approved";
    } else if (body.role === "reader") {
      update.writerStatus = "none";
    }
  }

  if (body.writerStatus) {
    update.writerStatus = body.writerStatus;
    // Align role with writerStatus changes
    if (body.writerStatus === "approved") {
      update.role = "writer";
    } else if (body.writerStatus === "rejected" || body.writerStatus === "needs-review") {
      // Keep as reader, just update status
      update.role = "reader";
    }
  }

  // Verified Writer Program
  if (typeof body.isVerified === "boolean") {
    update.isVerified = body.isVerified;
    update.verifiedAt = body.isVerified ? new Date() : null;
  }

  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
    select: "-passwordHash -resetToken -resetTokenExpiry",
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // ── Auto-sync: create/update Author doc when writer is approved ──
  if (user.writerStatus === "approved" || user.role === "writer") {
    try {
      const baseSlug = slugify(user.name);
      const existingAuthor = await Author.findOne({ email: user.email });

      if (!existingAuthor) {
        // Try the base slug; if taken, append a short suffix
        let slug = baseSlug;
        const slugTaken = await Author.findOne({ slug });
        if (slugTaken) {
          slug = `${baseSlug}-${Date.now().toString(36)}`;
        }

        // Copy expertise/qualification from the writerApplication if available
        const app = user.writerApplication;

        await Author.create({
          name: user.name,
          email: user.email,
          slug,
          bio: "",
          avatar: user.avatar || "",
          expertise: app?.expertise || [],
          qualification: app?.qualification || "",
          company: app?.company || "",
          experience: app?.experience || 0,
          social: {},
          articleCount: 0,
          totalViews: 0,
          userId: user._id,
        });
      } else {
        // Update name, avatar, isVerified and other fields
        const authorUpdate: Record<string, unknown> = {};
        if (user.name && user.name !== existingAuthor.name) {
          authorUpdate.name = user.name;
        }
        if (user.avatar && user.avatar !== existingAuthor.avatar) {
          authorUpdate.avatar = user.avatar;
        }
        // Sync verification
        if (typeof body.isVerified === "boolean") {
          authorUpdate.isVerified = body.isVerified;
          authorUpdate.verifiedAt = body.isVerified ? new Date() : null;
        }
        if (!existingAuthor.userId) {
          authorUpdate.userId = user._id;
        }

        if (Object.keys(authorUpdate).length > 0) {
          await Author.findByIdAndUpdate(existingAuthor._id, authorUpdate);
        }
      }
    } catch (authorErr) {
      // Non-fatal: log but don't fail the user update
      console.error("[PATCH /api/users/[id]] Author sync failed:", authorErr);
    }
  }

  // ── Sync isVerified to Author even if they're already a writer ──
  if (typeof body.isVerified === "boolean" && user.role === "writer") {
    try {
      await Author.findOneAndUpdate(
        { email: user.email },
        { isVerified: body.isVerified, verifiedAt: body.isVerified ? new Date() : null }
      );
    } catch (err) {
      console.error("[PATCH /api/users/[id]] Author verification sync failed:", err);
    }
  }

  return NextResponse.json({ success: true, data: user });
}

// DELETE /api/users/[id] — superadmin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;

  // Prevent self-deletion
  if (id === session.userId) {
    return NextResponse.json({ error: "Cannot delete your own account." }, { status: 400 });
  }

  await connectDB();
  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
