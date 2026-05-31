import { NextRequest, NextResponse } from "next/server";
import { getArticles, createArticle } from "@/lib/services/articleService";
import { calculateReadingTime } from "@/lib/utils/readingTime";
import { slugify } from "@/lib/utils/slugify";
import { getSession } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status =
      (searchParams.get("status") as "draft" | "published") || "published";
    const featured = searchParams.get("featured");
    const sort =
      (searchParams.get("sort") as "newest" | "oldest" | "popular") || "newest";

    const result = await getArticles({
      page,
      limit,
      status,
      featured: featured !== null ? featured === "true" : undefined,
      sort,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("[GET /api/articles]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "writer" && session.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { title, content, excerpt, categoryId, authorId } = body;
    if (!title || !content || !excerpt || !categoryId || !authorId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    const slug = body.slug || slugify(title);

    // Auto-calculate reading time
    const readingTime = calculateReadingTime(content);

    const article = await createArticle({
      ...body,
      slug,
      readingTime,
      category: categoryId,
      author: authorId,
      tags: body.tagIds || [],
      publishedAt: body.status === "published" ? new Date().toISOString() : undefined,
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/articles]", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Article with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}
