import type { Metadata } from "next";
import { Suspense } from "react";
import { searchArticles } from "@/lib/services/articleService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { SearchBar } from "@/components/search/SearchBar";
import { ArticleCardSkeleton } from "@/components/ui/Skeleton";
import { Search } from "lucide-react";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: "${q}"` : "Search Articles",
    description: q
      ? `Search results for "${q}" on LearnoBoy`
      : "Search all articles on LearnoBoy",
    robots: { index: false, follow: true },
  };
}

async function SearchResults({ query }: { query: string }) {
  const articles = await searchArticles(query, 20).catch(() => []);

  if (articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
          No results found for &ldquo;{query}&rdquo;
        </h2>
        <p className="text-[var(--text-secondary)]">
          Try a different search term or browse our categories.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Found <strong className="text-[var(--text-primary)]">{articles.length}</strong> results for &ldquo;{query}&rdquo;
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article._id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          Search Articles
        </h1>
        <div className="max-w-2xl">
          <SearchBar placeholder="Search articles, tutorials, guides..." />
        </div>
      </div>

      {q && q.trim().length >= 1 ? (
        <Suspense
          fallback={
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <SearchResults query={q.trim()} />
        </Suspense>
      ) : (
        <div className="text-center py-20">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-tertiary)]" />
          <p className="text-lg text-[var(--text-secondary)]">
            Enter a search term to find articles
          </p>
        </div>
      )}
    </div>
  );
}
