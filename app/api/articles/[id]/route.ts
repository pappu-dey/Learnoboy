import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getArticleById,
  updateArticle,
  deleteArticle,
} from "@/lib/services/articleService";
import { calculateReadingTime } from "@/lib/utils/readingTime";
import { getSession } from "@/lib/auth/session";
import { Author } from "@/lib/models";

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
    const session = await getSession();
    if (!session || (session.role !== "writer" && session.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Secure Author ownership check for writer role
    if (session.role === "writer") {
      const authorDoc = await Author.findOne({ userId: session.userId });
      if (!authorDoc) {
        return NextResponse.json(
          { success: false, error: "Writer profile not found for this account" },
          { status: 400 }
        );
      }
      body.author = String(authorDoc._id);
      body.authorId = String(authorDoc._id);
    }

    // Recalculate reading time if content changed
    if (body.content) {
      body.readingTime = calculateReadingTime(body.content);
    }

    // Sync multi-category fields
    if (Array.isArray(body.categoryIds) && body.categoryIds.length > 0) {
      body.categories = body.categoryIds;
      body.category = body.categoryIds[0]; // primary for URL routing
    } else if (body.categoryId) {
      body.category = body.categoryId;
      body.categories = [body.categoryId];
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

    if (article && article.status === "published") {
      try {
        const pCat = article.primaryCategory || "dsa";
        const subcat = article.subcategory || "arrays";
        revalidatePath("/");
        revalidatePath(`/${pCat}`);
        revalidatePath(`/${pCat}/${subcat}`);
        revalidatePath(`/${pCat}/${subcat}/${article.slug}`);
        console.log(`[Cache Revalidation] Triggered revalidation for updated article "${article.title}"`);
      } catch (revalError) {
        console.error("[Cache Revalidation] Failed to revalidate paths:", revalError);
      }
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
    const session = await getSession();
    if (!session || (session.role !== "writer" && session.role !== "superadmin")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const article = await deleteArticle(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    if (article && article.status === "published") {
      try {
        const pCat = article.primaryCategory || "dsa";
        const subcat = article.subcategory || "arrays";
        revalidatePath("/");
        revalidatePath(`/${pCat}`);
        revalidatePath(`/${pCat}/${subcat}`);
        revalidatePath(`/${pCat}/${subcat}/${article.slug}`);
        console.log(`[Cache Revalidation] Triggered revalidation for deleted article "${article.title}"`);
      } catch (revalError) {
        console.error("[Cache Revalidation] Failed to revalidate paths:", revalError);
      }
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
