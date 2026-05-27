import Link from "next/link";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { IArticle } from "@/types";
import { Clock, ArrowRight } from "lucide-react";

interface LatestArticlesProps {
  articles: IArticle[];
}

export function LatestArticles({ articles }: LatestArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="mb-16" aria-label="Latest articles">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Clock size={18} style={{ color: "var(--link-color)" }} />
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Latest Articles
          </h2>
        </div>
        <Link
          href="/search"
          className="flex items-center gap-1 text-sm font-medium transition-colors hover:gap-2"
          style={{ color: "var(--link-color)" }}
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
