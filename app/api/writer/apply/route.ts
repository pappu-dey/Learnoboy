import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth/session";
import { EXPERTISE_OPTIONS } from "@/types";

// GET /api/writer/apply — check own application status
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(session.userId)
    .select("writerStatus writerApplication isVerified role")
    .lean();

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      writerStatus: user.writerStatus,
      writerApplication: user.writerApplication ?? null,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
}

// POST /api/writer/apply — submit a writer application
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  await connectDB();

  const user = await User.findById(session.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  // Already a writer or superadmin
  if (user.role !== "reader") {
    return NextResponse.json(
      { error: "Only readers can apply to become a writer." },
      { status: 400 }
    );
  }

  // Already has a pending or approved application
  if (user.writerStatus === "pending" || user.writerStatus === "needs-review") {
    return NextResponse.json(
      { error: "You already have a pending application." },
      { status: 400 }
    );
  }
  if (user.writerStatus === "approved") {
    return NextResponse.json(
      { error: "Your application has already been approved." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { fullName, email, qualification, expertise, whyWrite, college, company, experience } = body;

  // Validate required fields
  if (!fullName?.trim()) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }
  if (!email?.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  if (!qualification?.trim()) {
    return NextResponse.json({ error: "Qualification is required." }, { status: 400 });
  }
  if (!Array.isArray(expertise) || expertise.length === 0) {
    return NextResponse.json(
      { error: "Select at least one area of expertise." },
      { status: 400 }
    );
  }
  // Validate expertise options
  const validExpertise = expertise.filter((e: string) =>
    (EXPERTISE_OPTIONS as readonly string[]).includes(e)
  );
  if (validExpertise.length === 0) {
    return NextResponse.json({ error: "Invalid expertise selection." }, { status: 400 });
  }
  if (!whyWrite?.trim() || whyWrite.trim().length < 20) {
    return NextResponse.json(
      { error: "Please explain why you want to write (at least 20 characters)." },
      { status: 400 }
    );
  }

  await User.findByIdAndUpdate(session.userId, {
    writerStatus: "pending",
    writerApplicationMessage: whyWrite.trim(),
    writerApplication: {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      qualification: qualification.trim(),
      expertise: validExpertise,
      whyWrite: whyWrite.trim(),
      college: college?.trim() || "",
      company: company?.trim() || "",
      experience: typeof experience === "number" ? experience : (parseInt(experience) || 0),
      appliedAt: new Date(),
    },
  });

  return NextResponse.json({
    success: true,
    message: "Application submitted successfully! We'll review it and get back to you.",
  });
}
