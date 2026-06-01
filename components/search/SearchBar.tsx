"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import type { IArticle } from "@/types";

interface SearchBarProps {
  compact?: boolean;
  placeholder?: string;
}

export function SearchBar({
  compact = false,
  placeholder = "Search articles...",
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setResults(data.data || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 150);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} role="search">
        <div
          className="relative flex items-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] transition-all duration-200 focus-within:border-[var(--link-color)] focus-within:ring-2 focus-within:ring-[var(--link-color)]/20"
        >
          <Search
            size={15}
            className="absolute left-3 text-[var(--text-tertiary)] pointer-events-none"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            placeholder={placeholder}
            aria-label="Search articles"
            className={`
              w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
              focus:outline-none
              ${compact ? "pl-9 pr-8 py-1.5 text-sm" : "pl-10 pr-10 py-2.5 text-sm"}
            `}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              aria-label="Clear search"
            >
              {isLoading ? (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <X size={14} />
              )}
            </button>
          )}
        </div>
      </form>

      {/* Dropdown results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 rounded-xl border border-[var(--border-color)] overflow-hidden z-50 shadow-lg"
          style={{ background: "var(--bg-base)" }}
        >
          {results.map((article) => {
            const category =
              typeof article.category === "object" ? article.category : null;
            return (
              <a
                key={article._id}
                href={article.primaryCategory && article.subcategory
                  ? `/${article.primaryCategory}/${article.subcategory}/${article.slug}`
                  : `/${category?.slug || "articles"}/${article.slug}`}
                onClick={() => setIsOpen(false)}
                className="flex flex-col px-4 py-2.5 hover:bg-[var(--bg-surface)] transition-colors border-b border-[var(--border-color)] last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: category?.color || "var(--link-color)" }}>
                    {category?.name || "Article"}
                  </span>
                  <span className="text-[10px] text-[var(--text-tertiary)] flex-shrink-0">
                    {article.readingTime} min read
                  </span>
                </div>
                <h4 
                  className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 mt-0.5 leading-snug"
                  dangerouslySetInnerHTML={{ __html: article.title }}
                />
                {article.snippet && (
                  <p 
                    className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5 font-normal"
                    dangerouslySetInnerHTML={{ __html: article.snippet }}
                  />
                )}
              </a>
            );
          })}
          <a
            href={`/search?q=${encodeURIComponent(query)}`}
            className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-medium hover:bg-[var(--bg-surface)] transition-colors"
            style={{ color: "var(--link-color)" }}
          >
            <Search size={13} />
            See all results for &ldquo;{query}&rdquo;
          </a>
        </div>
      )}
    </div>
  );
}
