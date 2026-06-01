import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/lib/models";
import { getSession } from "@/lib/auth/session";

// GET /api/feedback — superadmin only
export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    await connectDB();
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("[GET /api/feedback]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedbacks" },
      { status: 500 }
    );
  }
}

// POST /api/feedback — public
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, message, email } = body;

    if (!type || !message) {
      return NextResponse.json(
        { success: false, error: "Type and message are required" },
        { status: 400 }
      );
    }

    const feedback = await Feedback.create({
      type,
      message,
      email: email || "",
      status: "pending",
    });

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/feedback]", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
