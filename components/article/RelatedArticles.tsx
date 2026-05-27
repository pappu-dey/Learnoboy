import { ArticleCard } from "./ArticleCard";
import type { IArticle } from "@/types";
import { BookOpen } from "lucide-react";

interface RelatedArticlesProps {
  articles: IArticle[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section
      className="mt-12 pt-8 border-t border-[var(--border-color)]"
      aria-label="Related articles"
    >
      <div className="flex items-center gap-2 mb-6">
        <BookOpen size={18} style={{ color: "var(--link-color)" }} />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Related Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} variant="default" />
        ))}
      </div>
    </section>
  );
}
