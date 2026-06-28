import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import User, { IUserDocument } from "@/lib/models/User";

export const dynamic = "force-dynamic";


export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  try {
    await connectDB();
    
    const dbUser = await User.findById(session.userId)
      .select("name email role avatar")
      .lean<Pick<IUserDocument, "name" | "email" | "role" | "avatar">>();

    if (!dbUser) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
        avatar: dbUser.avatar || null,
      },
    });
  } catch (err) {
    console.error("[GET /api/profile/me] Error fetching user:", err);
    
    return NextResponse.json({
      success: true,
      user: {
        name: session.name,
        email: session.email,
        role: session.role,
        avatar: null,
      },
    });
  }
}
