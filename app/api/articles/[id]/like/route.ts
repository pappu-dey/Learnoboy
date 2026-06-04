import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/lib/models";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { increment } = body; // true to increment (+1), false to decrement (-1)

    await connectDB();
    const amount = increment === false ? -1 : 1;

    const article = await Article.findByIdAndUpdate(
      id,
      { $inc: { likes: amount } },
      { new: true }
    ).select("likes").lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, likes: (article as any).likes });
  } catch (error) {
    console.error("[PATCH /api/articles/[id]/like]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update likes" },
      { status: 500 }
    );
  }
}
