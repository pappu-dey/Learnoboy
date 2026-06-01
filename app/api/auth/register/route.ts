import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isSuperAdmin = email.toLowerCase() === (process.env.SUPERADMIN_EMAIL ?? "ikkapd@gmail.com").toLowerCase();
    const role = isSuperAdmin ? "superadmin" : "reader";

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      isVerified: true,
    });

    // Auto sign-in after registration
    await createSession({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
      avatar: user.avatar || null,
    });

    return NextResponse.json({ success: true, role });
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json({ error: "Server error. Please try again." }, { status: 500 });
  }
}
