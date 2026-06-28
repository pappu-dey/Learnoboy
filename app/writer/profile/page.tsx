import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import WriterProfileClient from "@/components/writer/WriterProfileClient";

export const metadata: Metadata = { title: "Author Profile — Writer — Learno-Boy" };

export default async function WriterProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  await connectDB();
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

  
  const author = JSON.parse(JSON.stringify(authorDoc));

  return (
    <WriterProfileClient
      authorId={String(author._id)}
      initial={author}
    />
  );
}
