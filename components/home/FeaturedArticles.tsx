import { ArticleCard } from "@/components/article/ArticleCard";
import type { IArticle } from "@/types";
import { Star } from "lucide-react";

interface FeaturedArticlesProps {
  articles: IArticle[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) return null;

  const [hero, ...rest] = articles;

  return (
    <section className="mb-16" aria-label="Featured articles">
      <div className="flex items-center gap-2 mb-6">
        <Star size={18} style={{ color: "#f59e0b" }} fill="#f59e0b" />
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">
          Featured Articles
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Large featured hero */}
        {hero && (
          <div className="lg:col-span-2">
            <ArticleCard article={hero} variant="featured" />
          </div>
        )}

        {/* Secondary featured */}
        {rest.length > 0 && (
          <div className="flex flex-col gap-4">
            {rest.slice(0, 2).map((article) => (
              <ArticleCard key={article._id} article={article} variant="default" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
