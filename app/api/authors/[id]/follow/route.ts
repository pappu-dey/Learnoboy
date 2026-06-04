import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";

/**
 * GET /api/authors/[id]/follow
 * Returns the current follower count for an author (by slug or _id).
 * No authentication required — read-only.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    let author = await Author.findOne({ slug: id }).select("followers").lean();
    if (!author && id.match(/^[a-f\d]{24}$/i)) {
      author = await Author.findById(id).select("followers").lean();
    }
    if (!author) {
      return NextResponse.json({ success: false, error: "Author not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, followers: (author as { followers?: number }).followers ?? 0 });
  } catch (err) {
    console.error("[GET /api/authors/[id]/follow]", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/authors/[id]/follow
 * Body: { action: "follow" | "unfollow" }
 *
 * [id] here is the author's SLUG (e.g. "pappu-dey").
 * We look up by slug first; if not found we try by MongoDB _id as a fallback.
 *
 * Atomically increments or decrements the followers counter on the Author document.
 * Returns the updated follower count.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const action: "follow" | "unfollow" = body.action;

    if (action !== "follow" && action !== "unfollow") {
      return NextResponse.json(
        { success: false, error: "action must be 'follow' or 'unfollow'" },
        { status: 400 }
      );
    }

    await connectDB();

    const delta = action === "follow" ? 1 : -1;

    // Try slug first, fall back to _id
    let updated = await Author.findOneAndUpdate(
      { slug: id },
      { $inc: { followers: delta } },
      { new: true, select: "followers slug" }
    );

    // Fallback: maybe the caller passed a MongoDB ObjectId
    if (!updated && id.match(/^[a-f\d]{24}$/i)) {
      updated = await Author.findByIdAndUpdate(
        id,
        { $inc: { followers: delta } },
        { new: true, select: "followers slug" }
      );
    }

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 }
      );
    }

    // Clamp to 0 if it somehow went negative
    if (updated.followers < 0) {
      await Author.findOneAndUpdate(
        { _id: updated._id },
        { $set: { followers: 0 } }
      );
      updated.followers = 0;
    }

    return NextResponse.json({ success: true, followers: updated.followers });
  } catch (err) {
    console.error("[POST /api/authors/[id]/follow]", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
