import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth/session";

// PATCH /api/authors/[id] — writer updates their own Author profile / superadmin updates any
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  await connectDB();

  // Fetch the author doc to verify ownership (unless superadmin)
  const authorDoc = await Author.findById(id);
  if (!authorDoc) {
    return NextResponse.json({ error: "Author not found." }, { status: 404 });
  }

  // Non-superadmins can only edit their own profile
  if (session.role !== "superadmin" && authorDoc.email !== session.email) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const body = await req.json();
  const allowed = [
    "bio", "avatar", "bannerImage", "social", "name",
    "location", "qualification", "company", "experience", "expertise",
  ];
  const update: Record<string, unknown> = {};

  for (const key of allowed) {
    if (body[key] !== undefined) {
      update[key] = body[key];
    }
  }

  // Superadmin-only fields
  if (session.role === "superadmin") {
    if (body.slug !== undefined) update.slug = body.slug;
    if (body.email !== undefined) update.email = body.email;
    if (typeof body.isVerified === "boolean") {
      update.isVerified = body.isVerified;
      update.verifiedAt = body.isVerified ? new Date() : null;
    }
  }

  const updated = await Author.findByIdAndUpdate(id, update, { new: true });

  // Dual-sync: update corresponding User document's name/avatar if set
  if (updated) {
    try {
      const userUpdate: Record<string, any> = {};
      if (update.avatar !== undefined) userUpdate.avatar = update.avatar;
      if (update.name !== undefined) userUpdate.name = update.name;

      if (Object.keys(userUpdate).length > 0) {
        await User.findOneAndUpdate(
          { email: updated.email },
          userUpdate
        );
      }
    } catch (userErr) {
      console.error("[PATCH /api/authors/[id]] Dual-sync to User collection failed:", userErr);
    }
  }

  return NextResponse.json({ success: true, data: updated });
}

// DELETE /api/authors/[id] — superadmin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const { id } = await params;
  await connectDB();
  await Author.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
