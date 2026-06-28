import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Donor } from "@/lib/models";


export async function GET() {
  try {
    await connectDB();
    const donors = await Donor.find({ status: "approved" })
      .sort({ amount: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: donors });
  } catch (error: any) {
    console.error("[GET /api/donors]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch donors" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, amount } = body;

    
    if (!name || !email || amount === undefined || amount === null) {
      return NextResponse.json(
        { success: false, error: "Name, email, and amount are required" },
        { status: 400 }
      );
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      return NextResponse.json(
        { success: false, error: "Amount must be a valid number of at least Rp 1" },
        { status: 400 }
      );
    }

    const donor = await Donor.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      amount: numericAmount,
      status: "pending",
    });

    return NextResponse.json({ success: true, data: donor }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/donors]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save donor record" },
      { status: 500 }
    );
  }
}
