import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth/session";

// GET /api/users — superadmin only
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await connectDB();
  const users = await User.find({}, "-passwordHash -resetToken -resetTokenExpiry").lean();
  return NextResponse.json({ success: true, data: users });
}

// PATCH /api/users — apply for writer (reader only)
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();
  const { message } = await req.json();

  const user = await User.findById(session.userId);
  if (!user) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (user.role !== "reader") {
    return NextResponse.json({ error: "Only readers can apply to become a writer." }, { status: 400 });
  }
  if (user.writerStatus === "pending") {
    return NextResponse.json({ error: "You already have a pending application." }, { status: 400 });
  }

  await User.findByIdAndUpdate(session.userId, {
    writerStatus: "pending",
    writerApplicationMessage: message || "",
  });

  return NextResponse.json({ success: true, message: "Application submitted. The admin will review it." });
}
