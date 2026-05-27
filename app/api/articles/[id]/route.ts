import { NextRequest, NextResponse } from "next/server";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/services/articleService";
import { calculateReadingTime } from "@/lib/utils/readingTime";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const article = await getArticleById(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("[GET /api/articles/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Recalculate reading time if content changed
    if (body.content) {
      body.readingTime = calculateReadingTime(body.content);
    }

    // Set publishedAt if publishing for the first time
    if (body.status === "published" && !body.publishedAt) {
      body.publishedAt = new Date().toISOString();
    }

    const article = await updateArticle(id, body);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: article });
  } catch (error) {
    console.error("[PUT /api/articles/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const deleted = await deleteArticle(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("[DELETE /api/articles/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
