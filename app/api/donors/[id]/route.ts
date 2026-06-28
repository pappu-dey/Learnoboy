import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Donor } from "@/lib/models";
import { getSession } from "@/lib/auth/session";


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
    const { amount, status } = body;

    const updateFields: Record<string, any> = {};

    if (amount !== undefined) {
      const numericAmount = Number(amount);
      if (isNaN(numericAmount) || numericAmount < 0) {
        return NextResponse.json(
          { success: false, error: "Amount must be a valid non-negative number" },
          { status: 400 }
        );
      }
      updateFields.amount = numericAmount;
    }

    if (status !== undefined) {
      if (!["pending", "approved", "rejected"].includes(status)) {
        return NextResponse.json(
          { success: false, error: "Invalid status value" },
          { status: 400 }
        );
      }
      updateFields.status = status;
    }

    await connectDB();
    const updated = await Donor.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[PATCH /api/donors/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update donor record" },
      { status: 500 }
    );
  }
}


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
    const deleted = await Donor.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Donor not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Donor deleted successfully" });
  } catch (error) {
    console.error("[DELETE /api/donors/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete donor" },
      { status: 500 }
    );
  }
}
