import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Author from "@/lib/models/Author";
import { getSession } from "@/lib/auth/session";
import { slugify } from "@/lib/utils/slugify";

// PATCH /api/users/[id] — superadmin: update role / approve/reject writer
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

  if (body.role) update.role = body.role;
  if (body.writerStatus) {
    update.writerStatus = body.writerStatus;
    // If approving writer application, promote role too
    if (body.writerStatus === "approved") update.role = "writer";
    if (body.writerStatus === "rejected") update.role = "reader";
  }

  const user = await User.findByIdAndUpdate(id, update, {
    new: true,
    select: "-passwordHash -resetToken -resetTokenExpiry",
  });
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });

  // ── Auto-sync: create/update Author doc when writer is approved ──
  if (body.writerStatus === "approved" || update.role === "writer") {
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

        await Author.create({
          name: user.name,
          email: user.email,
          slug,
          bio: "",
          avatar: (user as typeof user & { avatar?: string }).avatar || "",
          social: {},
          articleCount: 0,
        });
      } else {
        // Update avatar in case it changed
        const avatarVal = (user as typeof user & { avatar?: string }).avatar;
        if (avatarVal && !existingAuthor.avatar) {
          await Author.findByIdAndUpdate(existingAuthor._id, { avatar: avatarVal });
        }
      }
    } catch (authorErr) {
      // Non-fatal: log but don't fail the user update
      console.error("[PATCH /api/users/[id]] Author sync failed:", authorErr);
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
