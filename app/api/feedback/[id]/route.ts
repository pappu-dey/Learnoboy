import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/lib/models";
import { getSession } from "@/lib/auth/session";

/** PATCH /api/feedback/[id] — update feedback status (superadmin only) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["pending", "reviewed", "resolved"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH /api/feedback/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update feedback" },
      { status: 500 }
    );
  }
}

/** DELETE /api/feedback/[id] — delete feedback (superadmin only) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Feedback not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/feedback/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
