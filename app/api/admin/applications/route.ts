import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/lib/models/User";
import { getSession } from "@/lib/auth/session";


export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  await connectDB();

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status") || "all";

  const query: Record<string, unknown> = {};
  if (statusFilter === "all") {
    query.writerStatus = { $ne: "none" };
  } else {
    query.writerStatus = statusFilter;
  }

  const users = await User.find(query)
    .select("-passwordHash -resetToken -resetTokenExpiry")
    .sort({ "writerApplication.appliedAt": -1 })
    .lean();

  return NextResponse.json({ success: true, data: users });
}
