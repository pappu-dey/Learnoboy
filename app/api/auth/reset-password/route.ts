import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Token and new password are required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset token." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return NextResponse.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
