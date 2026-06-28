import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    
    const superadminEmail = process.env.SUPERADMIN_EMAIL?.toLowerCase();
    if (!superadminEmail && process.env.NODE_ENV === "production") {
      console.error("[login] SUPERADMIN_EMAIL is not set in production.");
    }
    const isSuperAdmin = superadminEmail
      ? user.email === superadminEmail
      : false;
    const role = isSuperAdmin ? "superadmin" : user.role;

    if (isSuperAdmin && user.role !== "superadmin") {
      await User.findByIdAndUpdate(user._id, { role: "superadmin" });
    }

    await createSession({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role,
      avatar: user.avatar || null,
    });

    return NextResponse.json({ success: true, role });
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
