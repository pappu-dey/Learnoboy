import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article, Author, Comment } from "@/lib/models";
import { getSession } from "@/lib/auth/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    await connectDB();

    const session = await getSession();
    const currentUserId = session?.userId;

    
    const [dbComments, dbReplies] = await Promise.all([
      Comment.find({ articleId, parentId: null }).sort({ createdAt: -1 }).lean(),
      Comment.find({ articleId, parentId: { $ne: null } }).sort({ createdAt: 1 }).lean(),
    ]);

    
    const repliesMap: Record<string, any[]> = {};
    dbReplies.forEach((reply: any) => {
      const pId = String(reply.parentId);
      if (!repliesMap[pId]) {
        repliesMap[pId] = [];
      }
      repliesMap[pId].push({
        _id: String(reply._id),
        authorName: reply.authorName,
        authorAvatar: reply.authorAvatar || "",
        role: reply.role || "reader",
        isArticleAuthor: reply.isArticleAuthor || false,
        content: reply.content,
        createdAt: reply.createdAt.toISOString(),
        likes: Array.isArray(reply.likes) ? reply.likes.length : 0,
        likedByUser: currentUserId && Array.isArray(reply.likes) 
          ? reply.likes.some((uid: any) => String(uid) === String(currentUserId)) 
          : false,
      });
    });

    
    const formattedComments = dbComments.map((comment: any) => {
      const commentIdStr = String(comment._id);
      return {
        _id: commentIdStr,
        authorName: comment.authorName,
        authorAvatar: comment.authorAvatar || "",
        role: comment.role || "reader",
        isArticleAuthor: comment.isArticleAuthor || false,
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
        likes: Array.isArray(comment.likes) ? comment.likes.length : 0,
        likedByUser: currentUserId && Array.isArray(comment.likes) 
          ? comment.likes.some((uid: any) => String(uid) === String(currentUserId)) 
          : false,
        replies: repliesMap[commentIdStr] || [],
      };
    });

    return NextResponse.json({ success: true, comments: formattedComments });
  } catch (error) {
    console.error("[GET /api/articles/[id]/comments]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: articleId } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { content, parentId } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { success: false, error: "Comment content is required" },
        { status: 400 }
      );
    }

    await connectDB();

    
    const article = await Article.findById(articleId).lean();
    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    let isArticleAuthor = false;
    if (article.author) {
      const authorDoc = await Author.findById(article.author).lean();
      if (authorDoc && authorDoc.userId && String(authorDoc.userId) === String(session.userId)) {
        isArticleAuthor = true;
      }
    }

    
    if (parentId) {
      const parentComment = await Comment.findById(parentId).lean();
      if (!parentComment) {
        return NextResponse.json(
          { success: false, error: "Parent comment not found" },
          { status: 404 }
        );
      }
    }

    const newComment = await Comment.create({
      articleId,
      user: session.userId,
      authorName: session.name,
      authorAvatar: session.avatar || "",
      role: session.role || "reader",
      isArticleAuthor,
      content: content.trim(),
      parentId: parentId || null,
      likes: [],
    });

    const formattedComment = {
      _id: String(newComment._id),
      authorName: newComment.authorName,
      authorAvatar: newComment.authorAvatar,
      role: newComment.role,
      isArticleAuthor: newComment.isArticleAuthor,
      content: newComment.content,
      createdAt: newComment.createdAt.toISOString(),
      likes: 0,
      likedByUser: false,
      replies: [],
    };

    return NextResponse.json({ success: true, comment: formattedComment });
  } catch (error) {
    console.error("[POST /api/articles/[id]/comments]", error);
    return NextResponse.json(
      { success: false, error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
