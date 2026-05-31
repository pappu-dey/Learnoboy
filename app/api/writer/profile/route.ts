import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { getSession } from "@/lib/auth/session";
import { EXPERTISE_OPTIONS } from "@/types";

// PATCH /api/writer/profile — authenticated writer updates their extended Author profile
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  if (session.role !== "writer" && session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden. Writers only." }, { status: 403 });
  }

  await connectDB();

  const authorDoc = await Author.findOne({ email: session.email });
  if (!authorDoc) {
    return NextResponse.json({ error: "Author profile not found." }, { status: 404 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = {};

  // Bio with word count validation (50–300 words)
  if (typeof body.bio === "string") {
    const wordCount = body.bio.trim().split(/\s+/).filter(Boolean).length;
    if (body.bio.trim() && wordCount < 10) {
      return NextResponse.json(
        { error: "Bio must be at least 10 words." },
        { status: 400 }
      );
    }
    if (wordCount > 300) {
      return NextResponse.json(
        { error: "Bio must not exceed 300 words." },
        { status: 400 }
      );
    }
    update.bio = body.bio.trim();
  }

  if (typeof body.avatar === "string") update.avatar = body.avatar;
  if (typeof body.bannerImage === "string") update.bannerImage = body.bannerImage;
  if (typeof body.location === "string") update.location = body.location.trim();
  if (typeof body.qualification === "string") update.qualification = body.qualification.trim();
  if (typeof body.company === "string") update.company = body.company.trim();
  if (typeof body.experience === "number") update.experience = body.experience;

  // Expertise validation
  if (Array.isArray(body.expertise)) {
    update.expertise = body.expertise.filter((e: string) =>
      (EXPERTISE_OPTIONS as readonly string[]).includes(e)
    );
  }

  // Social links — validate URLs
  if (body.social && typeof body.social === "object") {
    const social: Record<string, string> = {};
    const urlFields = ["twitter", "github", "linkedin", "website", "portfolio"] as const;
    for (const field of urlFields) {
      if (typeof body.social[field] === "string") {
        const val = body.social[field].trim();
        // Allow empty (clearing) or valid URL
        if (val && !val.startsWith("http://") && !val.startsWith("https://")) {
          return NextResponse.json(
            { error: `${field} must be a valid URL starting with http:// or https://` },
            { status: 400 }
          );
        }
        social[field] = val;
      }
    }
    if (Object.keys(social).length > 0) {
      update.social = { ...authorDoc.social, ...social };
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const updated = await Author.findByIdAndUpdate(
    authorDoc._id,
    update,
    { new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
