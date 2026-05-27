import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/services/articleService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 1) {
      return NextResponse.json(
        { success: false, error: "Query must be at least 1 character" },
        { status: 400 }
      );
    }

    const articles = await searchArticles(query.trim(), limit);

    return NextResponse.json({
      success: true,
      data: articles,
      total: articles.length,
      query,
    });
  } catch (error) {
    console.error("[GET /api/search]", error);
    return NextResponse.json(
      { success: false, error: "Search failed" },
      { status: 500 }
    );
  }
}
