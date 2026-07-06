import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getArticles, createArticle } from "@/lib/services/articleService";
import { calculateReadingTime } from "@/lib/utils/readingTime";
import { slugify } from "@/lib/utils/slugify";
import { getSession } from "@/lib/auth/session";
import { Author } from "@/lib/models";

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
    const search = searchParams.get("search") || undefined;

    const result = await getArticles({
      page,
      limit,
      status,
      featured: featured !== null ? featured === "true" : undefined,
      sort,
      search,
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

    
    let finalAuthorId = body.authorId;
    if (session.role === "writer") {
      let authorDoc = await Author.findOne({ userId: session.userId });
      if (!authorDoc) {
        
        authorDoc = await Author.findOne({ email: session.email });
        if (authorDoc) {
          authorDoc.userId = session.userId as any;
          await authorDoc.save();
        }
      }
      if (!authorDoc) {
        return NextResponse.json(
          { success: false, error: "Writer profile not found for this account" },
          { status: 400 }
        );
      }
      finalAuthorId = String(authorDoc._id);
    } else if (session.role === "superadmin" && !finalAuthorId) {
      let authorDoc = await Author.findOne({ userId: session.userId });
      if (!authorDoc) {
        
        authorDoc = await Author.findOne({ email: session.email });
        if (authorDoc) {
          authorDoc.userId = session.userId as any;
          await authorDoc.save();
        }
      }
      if (authorDoc) {
        finalAuthorId = String(authorDoc._id);
      }
    }

    if (!finalAuthorId) {
      return NextResponse.json(
        { success: false, error: "Please specify a valid author" },
        { status: 400 }
      );
    }

    
    const { title, content, excerpt, categoryId } = body;
    if (!title || !content || !excerpt || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    
    const slug = body.slug || slugify(title);

    
    const readingTime = calculateReadingTime(content);

    
    const categories = Array.isArray(body.categoryIds) && body.categoryIds.length > 0
      ? body.categoryIds
      : [categoryId];

    const article = await createArticle({
      ...body,
      slug,
      readingTime,
      category: categoryId,     
      categories,               
      author: finalAuthorId,
      publishedAt: body.status === "published" ? new Date().toISOString() : undefined,
    });

    if (article && article.status === "published") {
      try {
        const pCat = article.primaryCategory || "dsa";
        const subcat = article.subcategory || "arrays";
        revalidatePath("/");
        revalidatePath(`/${pCat}`);
        revalidatePath(`/${pCat}/${subcat}`);
        revalidatePath(`/${pCat}/${subcat}/${article.slug}`);
        revalidatePath("/sitemap.xml");
        console.log(`[Cache Revalidation] Triggered revalidation for newly created article "${article.title}"`);
      } catch (revalError) {
        console.error("[Cache Revalidation] Failed to revalidate paths:", revalError);
      }
    }

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
