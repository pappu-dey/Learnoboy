"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Pencil, Eye, Clock, Search, X, ArrowUpRight } from "lucide-react";
import { format } from "date-fns";

interface Article {
  _id: string;
  title: string;
  slug: string;
  views: number;
  readingTime: number;
  publishedAt?: string;
  coverImage?: string;
  category?: { _id: string; name: string; slug: string; color: string } | null;
  author?: { _id: string; name: string } | null;
  primaryCategory?: string;
  subcategory?: string;
}

interface Props {
  articles: Article[];
  status: string;
  newArticleHref?: string;
}

export function ArticlesTable({ articles, status, newArticleHref }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return articles;
    const q = search.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        (a.author && typeof a.author === "object" && a.author.name?.toLowerCase().includes(q)) ||
        (a.category && typeof a.category === "object" && a.category.name?.toLowerCase().includes(q))
    );
  }, [articles, search]);

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-5">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, author, or category…"
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/30 focus:border-[var(--link-color)] transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-[var(--text-tertiary)] mb-3">
          {filtered.length === 0
            ? "No results found"
            : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`}
        </p>
      )}

      {/* Table */}
      <div
        className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
        style={{ background: "var(--bg-surface)" }}
      >
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search size={32} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-40" />
            <p className="text-[var(--text-secondary)] font-medium">
              {search ? `No articles match "${search}"` : `No ${status} articles yet.`}
            </p>
            {!search && (
              <Link
                href={newArticleHref || "/admin/articles/new"}
                className="text-sm mt-2 inline-block hover:underline font-medium"
                style={{ color: "var(--link-color)" }}
              >
                Create one now →
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* ── Mobile card list ── */}
            <div className="md:hidden divide-y divide-[var(--border-color)]">
              {filtered.map((article) => {
                const category = typeof article.category === "object" ? article.category : null;
                const author = typeof article.author === "object" ? article.author : null;
                return (
                  <div key={article._id} className="p-4 flex gap-3 hover:bg-[var(--bg-muted)] transition-colors">
                    {article.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImage}
                        alt=""
                        className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-[var(--border-color)]"
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-xl border border-[var(--border-color)]"
                        style={{ background: "var(--bg-muted)" }}
                      >
                        📄
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2 leading-snug">
                        {article.title}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                        {category && (
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: `${category.color}15`, color: category.color }}
                          >
                            {category.name}
                          </span>
                        )}
                        {status === "draft" && (
                          <span
                            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ background: "rgba(245,158,11,0.12)", color: "#d97706" }}
                          >
                            Draft
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                          <Eye size={10} />{article.views.toLocaleString()}
                        </span>
                        {article.publishedAt && (
                          <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                            <Clock size={10} />{format(new Date(article.publishedAt), "MMM d")}
                          </span>
                        )}
                        {author && (
                          <span className="text-xs text-[var(--text-tertiary)] truncate">{author.name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Link
                          href={`/admin/articles/${article._id}/edit`}
                          className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                        >
                          <Pencil size={10} /> Edit
                        </Link>
                        {category && (
                          <Link
                            href={article.primaryCategory && article.subcategory
                              ? `/${article.primaryCategory}/${article.subcategory}/${article.slug}`
                              : `/${category.slug}/${article.slug}`}
                            target="_blank"
                            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                          >
                            <ArrowUpRight size={10} /> View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Desktop table ── */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                    {["Article", "Author", "Category", "Date", "Views", ""].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3.5 text-left text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {filtered.map((article) => {
                    const category = typeof article.category === "object" ? article.category : null;
                    const author = typeof article.author === "object" ? article.author : null;
                    return (
                      <tr
                        key={article._id}
                        className="hover:bg-[var(--bg-muted)] transition-colors group"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            {article.coverImage ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={article.coverImage}
                                alt=""
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[var(--border-color)]"
                              />
                            ) : (
                              <div
                                className="w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-lg border border-[var(--border-color)]"
                                style={{ background: "var(--bg-muted)" }}
                              >
                                📄
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1 max-w-xs">
                                {article.title}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5 text-xs text-[var(--text-tertiary)]">
                                <Clock size={10} />
                                {article.readingTime} min read
                                {status === "draft" && (
                                  <>
                                    <span className="mx-1">·</span>
                                    <span
                                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
                                      style={{ background: "rgba(245,158,11,0.12)", color: "#d97706" }}
                                    >
                                      Draft
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)]">
                          {author?.name || "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          {category ? (
                            <span
                              className="text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                              style={{ background: `${category.color}15`, color: category.color }}
                            >
                              {category.name}
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--text-tertiary)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-sm text-[var(--text-secondary)] whitespace-nowrap">
                          {article.publishedAt ? format(new Date(article.publishedAt), "MMM d, yyyy") : "—"}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                            <Eye size={12} />
                            {article.views.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admin/articles/${article._id}/edit`}
                              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                            >
                              <Pencil size={11} /> Edit
                            </Link>
                            {category && (
                              <Link
                                href={article.primaryCategory && article.subcategory
                                  ? `/${article.primaryCategory}/${article.subcategory}/${article.slug}`
                                  : `/${category.slug}/${article.slug}`}
                                target="_blank"
                                className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors"
                              >
                                <ArrowUpRight size={11} /> View
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

