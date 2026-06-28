import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import Tag from "@/lib/models/Tag";
import { getArticles } from "@/lib/services/articleService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Hash, ArrowLeft } from "lucide-react";

interface PageParams {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const tag = await Tag.findOne({ slug }).lean();
  if (!tag) return { title: "Tag Not Found" };
  return {
    title: `#${(tag as { name: string }).name} — LearnoBoy`,
    description: `Browse all articles tagged with #${(tag as { name: string }).name} on LearnoBoy.`,
  };
}

export default async function TagPage({ params }: PageParams) {
  const { slug } = await params;

  await connectDB();
  const tag = await Tag.findOne({ slug }).lean() as { name: string; slug: string; articleCount: number } | null;
  if (!tag) notFound();

  const { data: articles, total } = await getArticles({
    tag: slug,
    status: "published",
    limit: 50,
    sort: "newest",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors mb-8"
      >
        <ArrowLeft size={14} /> Back to home
      </Link>

      {}
      <div className="mb-10">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-4"
          style={{
            background: "color-mix(in srgb, var(--link-color) 10%, var(--bg-surface))",
            color: "var(--link-color)",
            border: "1px solid color-mix(in srgb, var(--link-color) 20%, transparent)",
          }}
        >
          <Hash size={15} />
          {tag.name}
        </div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
          #{tag.name}
        </h1>
        <p className="mt-2 text-[var(--text-secondary)] text-sm">
          {total} article{total !== 1 ? "s" : ""} tagged with{" "}
          <span className="font-semibold text-[var(--text-primary)]">#{tag.name}</span>
        </p>
      </div>

      {}
      {articles.length === 0 ? (
        <div className="text-center py-20">
          <Hash size={36} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-40" />
          <p className="text-[var(--text-secondary)]">No articles with this tag yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
