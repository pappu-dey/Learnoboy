import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { searchArticles } from "@/lib/services/articleService";
import { SearchBar } from "@/components/search/SearchBar";
import { Search, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";
import type { ICategory, IAuthor } from "@/types";
import { Skeleton } from "@/components/ui/Skeleton";

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
      <div className="text-center py-20 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
        <div className="text-6xl mb-4 animate-bounce">🔍</div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          No results found for &ldquo;{query}&rdquo;
        </h2>
        <p className="text-[var(--text-secondary)] max-w-md mx-auto">
          We couldn't find any articles matching your search. Try using different keywords, or check for typos.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-[var(--text-secondary)] mb-6">
        Found <strong className="text-[var(--text-primary)] font-semibold">{articles.length}</strong> results for &ldquo;{query}&rdquo;
      </p>
      <div className="flex flex-col gap-6">
        {articles.map((article) => {
          const category =
            typeof article.category === "object"
              ? (article.category as ICategory)
              : null;
          const author =
            typeof article.author === "object"
              ? (article.author as IAuthor)
              : null;
          const href = article.primaryCategory && article.subcategory
            ? `/${article.primaryCategory}/${article.subcategory}/${article.slug}`
            : `/${category?.slug || "articles"}/${article.slug}`;

          return (
            <article
              key={article._id}
              className="group relative flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--link-color)]/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300"
            >
              {article.coverImage && (
                <a
                  href={href}
                  className="relative w-full md:w-52 h-36 md:h-auto rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-muted)] block"
                >
                  <Image
                    src={article.coverImage}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 208px"
                  />
                </a>
              )}

              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)] mb-3">
                  {category && (
                    <span
                      className="px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider bg-[var(--bg-base)] border border-[var(--border-color)]"
                      style={{ color: category.color, borderColor: `${category.color}40` }}
                    >
                      {category.name}
                    </span>
                  )}
                  {category && <span className="opacity-40">•</span>}
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="opacity-70" />
                    {article.readingTime} min read
                  </span>
                  <span className="opacity-40">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="opacity-70" />
                    {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : "Draft"}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-extrabold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors mb-2.5 leading-snug">
                  <a href={href} dangerouslySetInnerHTML={{ __html: article.title }} />
                </h2>

                <p
                  className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: article.excerpt }}
                />

                {article.snippet && (
                  <div
                    className="mt-1 p-3 rounded-xl border border-[var(--border-color)]/60 bg-[var(--bg-base)]/40 relative overflow-hidden transition-colors"
                    style={{
                      borderLeft: `3px solid ${category?.color || "var(--link-color)"}`
                    }}
                  >
                    <div className="text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: category?.color || "var(--link-color)" }}></span>
                      Matched Content Preview
                    </div>
                    <p
                      className="text-xs text-[var(--text-secondary)] leading-relaxed italic"
                      dangerouslySetInnerHTML={{ __html: article.snippet }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2.5 mt-4 pt-3.5 border-t border-[var(--border-color)]/60">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-[var(--border-color)] bg-[var(--bg-muted)]">
                    {author?.avatar ? (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--link-color)] text-white font-bold text-[9px]">
                        {author?.name ? author.name.charAt(0) : "U"}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {author?.name || "Unknown"}
                  </span>
                  {author?.isVerified && (
                    <span className="text-[var(--link-color)] text-[10px]" title="Verified Writer">✓</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-3 tracking-tight">
          Search Articles
        </h1>
        <p className="text-[var(--text-secondary)] mb-6 text-sm max-w-lg">
          Search terms will go through full article content and highlight matched sections below.
        </p>
        <div className="max-w-2xl bg-[var(--bg-surface)] p-1.5 rounded-xl border border-[var(--border-color)] shadow-sm">
          <SearchBar placeholder="Search articles, tutorials, guides..." />
        </div>
      </div>

      {q && q.trim().length >= 1 ? (
        <Suspense
          fallback={
            <div className="flex flex-col gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-[var(--border-color)]"
                  style={{ background: "var(--bg-surface)" }}
                >
                  <Skeleton className="w-full md:w-52 h-36 rounded-xl flex-shrink-0" />
                  <div className="flex-1 flex flex-col justify-between py-1 gap-3">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton lines={2} />
                    <Skeleton className="h-5 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          <SearchResults query={q.trim()} />
        </Suspense>
      ) : (
        <div className="text-center py-24 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border-color)]">
          <Search size={48} className="mx-auto mb-4 text-[var(--text-tertiary)] animate-pulse" />
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            Looking for something?
          </h3>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto">
            Type your query into the search bar above to scour full-text articles and tutorials.
          </p>
        </div>
      )}
    </div>
  );
}
