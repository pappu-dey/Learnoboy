import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import { Author, Feedback } from "@/lib/models";
import WriterSuggestionsClient from "@/components/writer/WriterSuggestionsClient";

export const metadata: Metadata = { title: "Suggestions — Writer — Learno-Boy" };

export default async function WriterSuggestionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();

  // Find this writer's Author document to link suggestions
  const authorDoc = await Author.findOne({ email: session.email }).lean();

  if (!authorDoc) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">✍️</div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-2">Author Profile Not Ready</h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Your Author profile is created automatically when an admin approves your writer application.
            If you believe this is an error, please contact a site administrator.
          </p>
        </div>
      </div>
    );
  }

  // Get Suggestions of type "Content Suggestion" linked to this author
  const rawSuggestions = await Feedback.find({
    author: authorDoc._id,
    type: "Content Suggestion",
  })
    .populate("article", "title slug primaryCategory subcategory")
    .sort({ createdAt: -1 })
    .lean();

  // Deeply serialize Mongoose docs to plain objects
  const suggestions = JSON.parse(JSON.stringify(rawSuggestions));

  return <WriterSuggestionsClient initialSuggestions={suggestions} />;
}
