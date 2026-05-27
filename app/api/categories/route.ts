import { NextRequest, NextResponse } from "next/server";
import {
  getAllCategories,
  createCategory,
} from "@/lib/services/categoryService";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
  try {
    const categories = await getAllCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("[GET /api/categories]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, icon, color } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(name);

    const category = await createCategory({
      name,
      slug,
      description,
      icon: icon || "📚",
      color: color || "#3b82f6",
    });

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/categories]", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Category with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
