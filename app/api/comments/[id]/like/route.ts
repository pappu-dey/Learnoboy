import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Comment } from "@/lib/models";
import { getSession } from "@/lib/auth/session";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to like comments" },
        { status: 401 }
      );
    }

    await connectDB();
    const comment = await Comment.findById(id);

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "Comment not found" },
        { status: 404 }
      );
    }

    const currentUserIdStr = String(session.userId);
    const index = comment.likes.findIndex((uid: any) => String(uid) === currentUserIdStr);

    let likedByUser = false;
    if (index > -1) {
      
      comment.likes.splice(index, 1);
      likedByUser = false;
    } else {
      
      comment.likes.push(session.userId as any);
      likedByUser = true;
    }

    await comment.save();

    return NextResponse.json({
      success: true,
      likes: comment.likes.length,
      likedByUser,
    });
  } catch (error) {
    console.error("[PATCH /api/comments/[id]/like]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update comment likes" },
      { status: 500 }
    );
  }
}
