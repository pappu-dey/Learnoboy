import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Verification token is required." }, { status: 400 });
    }

    await connectDB();

    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json({
        error: "Invalid or expired verification token. Please register again or request a new link.",
      }, { status: 400 });
    }

    
    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      verifiedAt: new Date(),
      $unset: {
        verificationToken: "",
        verificationTokenExpiry: "",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your email has been successfully verified! You can now sign in to your account.",
    });
  } catch (err) {
    console.error("[verify-api]", err);
    return NextResponse.json({ error: "Server error during verification." }, { status: 500 });
  }
}
