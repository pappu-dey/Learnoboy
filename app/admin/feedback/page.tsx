import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { Feedback } from "@/lib/models";
import { serializeArray } from "@/lib/utils/serialize";
import { AdminFeedbackClient } from "@/components/admin/AdminFeedbackClient";
import type { IFeedback } from "@/types";

export const metadata: Metadata = { title: "Manage User Feedback" };
export const dynamic = "force-dynamic";

export default async function AdminFeedbackPage() {
  try {
    await connectDB();
    const rawFeedbacks = await Feedback.find().sort({ createdAt: -1 }).lean();
    const feedbacks = serializeArray(rawFeedbacks) as unknown as IFeedback[];
    return <AdminFeedbackClient initialFeedbacks={feedbacks} />;
  } catch (error) {
    console.error("❌ Failed to fetch feedbacks in AdminFeedbackPage:", error);
    return <AdminFeedbackClient initialFeedbacks={[]} />;
  }
}
