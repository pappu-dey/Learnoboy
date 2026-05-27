import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Category } from "@/lib/models";
import { deleteCategory, updateCategory } from "@/lib/services/categoryService";

/** GET /api/categories/[id] */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const category = await Category.findById(id).lean();
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("[GET /api/categories/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

/** PATCH /api/categories/[id] */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateCategory(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH /api/categories/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

/** DELETE /api/categories/[id] */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteCategory(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("[DELETE /api/categories/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
