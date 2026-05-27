import type { Metadata } from "next";
import { getAllCategories } from "@/lib/services/categoryService";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import Tag from "@/lib/models/Tag";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { serializeArray } from "@/lib/utils/serialize";
import type { IAuthor, ITag } from "@/types";

export const metadata: Metadata = { title: "Create New Article" };

export default async function NewArticlePage() {
  let categories: IAuthor[] = [];
  let authors: IAuthor[] = [];
  let tags: ITag[] = [];
  let dbConnected = true;

  try {
    await connectDB();
    [categories, authors, tags] = await Promise.all([
      getAllCategories().catch(() => []),
      Author.find().select("_id name slug").lean().catch(() => []) as Promise<IAuthor[]>,
      Tag.find().select("_id name slug").lean().catch(() => []) as Promise<ITag[]>,
    ]) as [IAuthor[], IAuthor[], ITag[]];
  } catch {
    dbConnected = false;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          New Article
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">
          Write and publish a new educational article
        </p>
      </div>

      {!dbConnected && (
        <div className="mb-6 p-4 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700">
          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
            ⚠️ Database not connected
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Open{" "}
            <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-xs font-mono">
              .env.local
            </code>{" "}
            and set your{" "}
            <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-xs font-mono">
              MONGODB_URI
            </code>
            , then run{" "}
            <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900 text-xs font-mono">
              npm run seed
            </code>{" "}
            to populate categories and authors.
          </p>
        </div>
      )}

      {/* Serialize all Mongoose ObjectIds → strings before passing to client component */}
      <ArticleForm
        categories={serializeArray(categories as unknown as import("@/types").ICategory[])}
        authors={serializeArray(authors as unknown as IAuthor[]) as unknown as IAuthor[]}
        tags={serializeArray(tags)}
      />
    </div>
  );
}
