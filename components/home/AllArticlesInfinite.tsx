"use client";

import { useState, useEffect, useRef } from "react";
import { ArticleCard } from "@/components/article/ArticleCard";
import type { IArticle } from "@/types";
import { Library, Loader2, Search, X } from "lucide-react";

export function AllArticlesInfinite() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const [page, setPage] = useState(2); 
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const observerTarget = useRef<HTMLDivElement>(null);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  
  useEffect(() => {
    setArticles([]);
    const startPage = debouncedSearchQuery.trim() === "" ? 2 : 1;
    setPage(startPage);
    setHasMore(true);

    const fetchInitial = async () => {
      setLoading(true);
      try {
        const searchParam = debouncedSearchQuery.trim()
          ? `&search=${encodeURIComponent(debouncedSearchQuery.trim())}`
          : "";
        const res = await fetch(
          `/api/articles?page=${startPage}&limit=8&status=published&sort=newest${searchParam}`
        );
        const data = await res.json();

        if (data.success) {
          const newArticles = data.data ?? [];
          setArticles(newArticles);
          setPage(startPage + 1);
          if (newArticles.length < 8) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load initial search articles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitial();
  }, [debouncedSearchQuery]);

  
  const fetchMoreArticles = async (pageNum: number, searchVal: string) => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const searchParam = searchVal.trim()
        ? `&search=${encodeURIComponent(searchVal.trim())}`
        : "";
      const res = await fetch(
        `/api/articles?page=${pageNum}&limit=8&status=published&sort=newest${searchParam}`
      );
      const data = await res.json();

      if (data.success) {
        const newArticles = data.data ?? [];
        if (newArticles.length === 0) {
          setHasMore(false);
        } else {
          setArticles((prev) => {
            const existingIds = new Set(prev.map((a) => a._id));
            const uniqueNew = newArticles.filter(
              (a: IArticle) => !existingIds.has(a._id)
            );
            if (uniqueNew.length === 0) {
              setHasMore(false);
            }
            return [...prev, ...uniqueNew];
          });
          setPage(pageNum + 1);
          if (newArticles.length < 8) {
            setHasMore(false);
          }
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Failed to load infinite articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchMoreArticles(page, debouncedSearchQuery);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, debouncedSearchQuery]);

  return (
    <section
      className="mb-16 border-t border-[var(--border-color)] pt-12"
      aria-label="Explore more articles"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Library size={18} style={{ color: "var(--link-color)" }} />
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Explore All Articles
          </h2>
        </div>

        {}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search size={16} className="text-[var(--text-tertiary)]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles by title, tags or content..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--link-color)] focus:outline-none transition-all focus:shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {articles.length === 0 && !loading && !hasMore ? (
        <div
          className="text-center py-20 rounded-2xl border border-[var(--border-color)]"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
            No articles found
          </h3>
          <p className="text-[var(--text-secondary)] text-sm max-w-sm mx-auto">
            We couldn't find any articles matching "{debouncedSearchQuery}". Try checking for spelling or using different keywords.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} variant="default" />
            ))}
          </div>

          {/* Intersection Observer Sentinel */}
          <div ref={observerTarget} className="w-full flex justify-center py-10 mt-4">
            {loading && (
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-color)] shadow-sm animate-pulse"
                style={{ background: "var(--bg-surface)" }}
              >
                <Loader2 size={16} className="animate-spin text-[var(--link-color)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  Loading articles…
                </span>
              </div>
            )}
            {!hasMore && articles.length > 0 && (
              <p
                className="text-xs font-medium px-4 py-1.5 rounded-full border border-[var(--border-color)] text-[var(--text-tertiary)]"
                style={{ background: "var(--bg-surface)" }}
              >
                You've reached the end of the collection ✨
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
