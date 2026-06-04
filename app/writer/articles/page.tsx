import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { getArticles } from "@/lib/services/articleService";
import { serializeArray } from "@/lib/utils/serialize";
import { PlusCircle, ArrowRight } from "lucide-react";
import { ArticlesTable } from "@/components/admin/ArticlesTable";

export const metadata: Metadata = { title: "My Articles — Writer — Learno-Boy" };

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function WriterArticlesPage({ searchParams }: Props) {
  const { status = "published", page = "1" } = await searchParams;
  const currentPage = parseInt(page);

  const session = await getSession();
  if (!session) return null;

  await connectDB();

  // Find this writer's Author document to filter articles
  const authorDoc = await Author.findOne({ email: session.email }).lean();
  const authorId = authorDoc ? String((authorDoc as { _id: unknown })._id) : undefined;

  const { data: rawArticles, total, totalPages } = await getArticles({
    status: status as "draft" | "published",
    page: currentPage,
    limit: 20,
    sort: "newest",
    authorId,
  }).catch(() => ({ data: [], total: 0, totalPages: 1, page: 1, limit: 20 }));

  const articles = serializeArray(rawArticles);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">My Articles</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {total} {status} article{total !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/writer/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 duration-200"
          style={{ background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}
        >
          <PlusCircle size={15} />
          New Article
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1.5 rounded-xl w-fit" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
        {[
          { value: "published", label: "✅ Published" },
          { value: "draft", label: "📝 Drafts" },
        ].map(({ value, label }) => (
          <Link
            key={value}
            href={`/writer/articles?status=${value}`}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={
              status === value
                ? { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", boxShadow: "0 2px 6px rgba(16,185,129,0.3)" }
                : { color: "var(--text-secondary)" }
            }
          >
            {label}
          </Link>
        ))}
      </div>

      <ArticlesTable 
        articles={articles as any} 
        status={status} 
        newArticleHref="/writer/articles/new" 
        editArticleHrefPrefix="/writer/articles" 
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {currentPage > 1 && (
            <Link
              href={`/writer/articles?status=${status}&page=${currentPage - 1}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
              style={{ background: "var(--bg-surface)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
            >
              ← Prev
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/writer/articles?status=${status}&page=${p}`}
              className="w-9 h-9 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all duration-200"
              style={
                p === currentPage
                  ? { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", borderColor: "transparent", boxShadow: "0 2px 8px rgba(16,185,129,0.35)" }
                  : { background: "var(--bg-surface)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }
              }
            >
              {p}
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link
              href={`/writer/articles?status=${status}&page=${currentPage + 1}`}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all"
              style={{ background: "var(--bg-surface)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }}
            >
              Next <ArrowRight size={13} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
