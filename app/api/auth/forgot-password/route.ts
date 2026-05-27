import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // Always return success to avoid email enumeration
    if (!user) {
      return NextResponse.json({ success: true, message: "If an account exists, a reset link has been generated." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await User.findByIdAndUpdate(user._id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // TODO: Send email with resetUrl using a mail provider (Resend, SendGrid, etc.)
    // For now, return the URL directly for development use.
    return NextResponse.json({
      success: true,
      message: "Reset link generated.",
      // Only expose in development — remove before production
      resetUrl: process.env.NODE_ENV !== "production" ? resetUrl : undefined,
    });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
