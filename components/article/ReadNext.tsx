"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import type { IArticle } from "@/types";

interface ReadNextProps {
  nextArticle?: IArticle | null;
}

export function ReadNext({ nextArticle }: ReadNextProps) {
  if (!nextArticle) return null;

  const categorySlug = nextArticle.primaryCategory;
  const subcategorySlug = nextArticle.subcategory;
  const articleUrl = `/${categorySlug}/${subcategorySlug}/${nextArticle.slug}`;

  return (
    <section className="mt-8 pt-8 border-t border-[var(--border-color)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={18} style={{ color: "var(--link-color)" }} />
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Read Next
          </h2>
        </div>
        <span className="hidden md:inline text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
          Up next
        </span>
      </div>

      {/* Mobile view: simple text link displaying just the title */}
      <div className="block md:hidden">
        <Link href={articleUrl} className="group flex items-center justify-between p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--link-color)] transition-colors">
          <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors line-clamp-1 pr-4">
            {nextArticle.title}
          </span>
          <ArrowRight size={14} className="text-[var(--link-color)] flex-shrink-0 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Desktop view: full feature card */}
      <div className="hidden md:block">
        <Link href={articleUrl} className="group block">
          <div
            className="rounded-2xl border border-[var(--border-color)] p-5 flex flex-col md:flex-row gap-5 transition-all duration-300 hover:shadow-lg hover:border-[var(--link-color)] overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            {/* Cover Image teaser */}
            {nextArticle.coverImage && (
              <div className="relative w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={nextArticle.coverImage}
                  alt={nextArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            )}

            {/* Details */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--link-color)] uppercase tracking-wider mb-1">
                  <span className="uppercase">{nextArticle.subcategory}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} /> {nextArticle.readingTime} min read
                  </span>
                </div>
                <h3 className="text-base md:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors mb-2 line-clamp-2 leading-snug">
                  {nextArticle.title}
                </h3>
                {nextArticle.excerpt && (
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                    {nextArticle.excerpt}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs font-bold text-[var(--link-color)] mt-3">
                <span>Start Reading</span>
                <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
