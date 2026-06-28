import { connectDB } from "@/lib/mongodb";
import { Donor } from "@/lib/models";
import { DonorsClient } from "@/components/donors/DonorsClient";
import type { Metadata } from "next";


export const revalidate = 0;

export const metadata: Metadata = {
  title: "Supporters & Donors - LearnoBoy",
  description: "A public honor roll celebrating the generous donors who keep high-quality programming education free and ad-free.",
};

export default async function DonorsPage() {
  await connectDB();
  
  const rawDonors = await Donor.find({ status: "approved" })
    .sort({ amount: -1, createdAt: -1 })
    .lean();

  
  const donors = rawDonors.map((d: any) => ({
    _id: d._id.toString(),
    name: d.name,
    email: d.email,
    amount: d.amount,
    createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: d.updatedAt ? d.updatedAt.toISOString() : new Date().toISOString(),
  }));

  return <DonorsClient initialDonors={donors} />;
}
