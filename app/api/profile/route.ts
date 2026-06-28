import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import Author from "@/lib/models/Author";
import { getSession, createSession } from "@/lib/auth/session";


export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();

  const body = await req.json();
  const update: Record<string, string> = {};

  if (typeof body.name === "string" && body.name.trim()) {
    update.name = body.name.trim();
  }
  if (typeof body.avatar === "string") {
    update.avatar = body.avatar;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updatedUser = await User.findByIdAndUpdate(
    session.userId,
    update,
    { new: true, select: "-passwordHash -resetToken -resetTokenExpiry" }
  );

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  
  await createSession({
    userId: session.userId,
    name: updatedUser.name,
    email: session.email,
    role: session.role,
    avatar: updatedUser.avatar || null,
  });

  
  if (updatedUser.role === "writer" || updatedUser.role === "superadmin") {
    try {
      const authorUpdate: Record<string, any> = {};
      if (update.avatar !== undefined) authorUpdate.avatar = update.avatar;
      if (update.name !== undefined) authorUpdate.name = update.name;

      if (Object.keys(authorUpdate).length > 0) {
        await Author.findOneAndUpdate(
          { email: updatedUser.email },
          authorUpdate
        );
      }
    } catch (authorErr) {
      console.error("[PATCH /api/profile] Dual-sync to Author collection failed:", authorErr);
    }
  }

  return NextResponse.json({ success: true, data: updatedUser });
}
