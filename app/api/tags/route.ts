import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
  try {
    await connectDB();
    const tags = await Tag.find().sort({ articleCount: -1 }).lean();
    return NextResponse.json({ success: true, data: tags });
  } catch (error) {
    console.error("[GET /api/tags]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Tag name is required" },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(name);
    const tag = new Tag({ name, slug });
    await tag.save();

    return NextResponse.json({ success: true, data: tag }, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/tags]", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Tag already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
