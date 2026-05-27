import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { slugify } from "@/lib/utils/slugify";

export async function GET() {
  try {
    await connectDB();
    const authors = await Author.find().sort({ name: 1 }).lean();
    return NextResponse.json({ success: true, data: authors });
  } catch (error) {
    console.error("[GET /api/authors]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch authors" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, bio, avatar, social } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const slug = body.slug || slugify(name);
    const author = new Author({ name, email, slug, bio, avatar, social });
    await author.save();

    return NextResponse.json({ success: true, data: author }, { status: 201 });
  } catch (error: unknown) {
    console.error("[POST /api/authors]", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: number }).code === 11000
    ) {
      return NextResponse.json(
        { success: false, error: "Author with this email already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create author" },
      { status: 500 }
    );
  }
}
