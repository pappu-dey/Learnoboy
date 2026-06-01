import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { getAllCategories } from "@/lib/services/categoryService";
import Tag from "@/lib/models/Tag";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { serializeArray } from "@/lib/utils/serialize";
import type { IAuthor, ITag } from "@/types";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "New Article — Writer — Learno-Boy" };

export default async function WriterNewArticlePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "writer" && session.role !== "superadmin") {
    redirect("/profile");
  }

  await connectDB();

  // Find this writer's Author document to pre-fill authorId
  const authorDoc = await Author.findOne({ email: session.email }).lean();
  const authorId = authorDoc ? String((authorDoc as { _id: unknown })._id) : undefined;

  let categories: IAuthor[] = [];
  let authors: IAuthor[] = [];
  let tags: ITag[] = [];

  try {
    [categories, authors, tags] = await Promise.all([
      getAllCategories().catch(() => []),
      Author.find().select("_id name slug").lean().catch(() => []) as Promise<IAuthor[]>,
      Tag.find().select("_id name slug").lean().catch(() => []) as Promise<ITag[]>,
    ]) as [IAuthor[], IAuthor[], ITag[]];
  } catch {
    // continue with empty arrays
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">New Article</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Write and publish a new educational article
        </p>
      </div>

      <ArticleForm
        categories={serializeArray(categories as unknown as import("@/types").ICategory[])}
        authors={serializeArray(authors as unknown as IAuthor[]) as unknown as IAuthor[]}
        tags={serializeArray(tags)}
        initialData={authorId ? { authorId } : undefined}
        sessionRole={session.role}
      />
    </div>
  );
}
