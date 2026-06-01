import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Donor } from "@/lib/models";
import { serializeArray } from "@/lib/utils/serialize";
import { AdminDonorsClient } from "@/components/admin/AdminDonorsClient";
import type { IDonor } from "@/types";

export const metadata: Metadata = { title: "Manage Donors & Leaderboard" };
export const dynamic = "force-dynamic";

export default async function AdminDonorsPage() {
  try {
    await connectDB();
    
    // Fetch all donors (both pending and verified)
    const rawDonors = await Donor.find().sort({ createdAt: -1 }).lean();
    const donors = serializeArray(rawDonors) as unknown as IDonor[];
    
    return <AdminDonorsClient initialDonors={donors} />;
  } catch (error) {
    console.error("❌ Failed to fetch donors in AdminDonorsPage:", error);
    return <AdminDonorsClient initialDonors={[]} />;
  }
}
