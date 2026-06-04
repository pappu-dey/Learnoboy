import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  lines?: number;
  shimmer?: boolean;
  style?: CSSProperties;
}

/** Base block with shimmer sweep animation */
export function Skeleton({ className = "", lines, shimmer = true, style }: SkeletonProps) {
  const cls = shimmer ? "skeleton-shimmer" : "animate-pulse bg-[var(--bg-muted)] rounded";

  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 ${cls} ${i === lines - 1 ? "w-3/4" : "w-full"}`}
            style={{ animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    );
  }

  return <div className={`${cls} ${className}`} style={style} />;
}

/* ─── Article card skeleton ─── */
export function ArticleCardSkeleton() {
  return (
    <div
      className="rounded-xl border border-[var(--border-color)] p-5 space-y-3"
      style={{ background: "var(--bg-surface)" }}
    >
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-4/5" />
      <Skeleton lines={3} />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

/* ─── Featured hero card skeleton (large) ─── */
export function FeaturedCardSkeleton() {
  return (
    <div
      className="rounded-xl border border-[var(--border-color)] overflow-hidden"
      style={{ background: "var(--bg-surface)" }}
    >
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton lines={2} />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Hero section skeleton ─── */
export function HeroSkeleton() {
  return (
    <section
      className="relative overflow-hidden flex items-center"
      style={{ minHeight: "calc(100vh - 64px)", padding: "60px 0" }}
    >
      {/* subtle bg blob */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% -10%, rgba(37,99,235,0.06) 0%, transparent 60%)",
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          gap: 48,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
        }}
        className="max-lg:flex max-lg:flex-col max-lg:items-center"
      >
        {/* Left — text */}
        <div className="space-y-5 max-lg:w-full max-lg:max-w-lg">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-5/6" />
          {/* search bar */}
          <Skeleton className="h-12 w-full rounded-2xl" />
          {/* stats row */}
          <div className="flex gap-8 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-6 w-14" />
                <Skeleton className="h-3 w-10" />
              </div>
            ))}
          </div>
        </div>

        {/* Right — illustration placeholder */}
        <div className="max-lg:hidden">
          <Skeleton className="h-[380px] w-full rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

/* ─── Category pills skeleton ─── */
export function CategorySkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="mb-10">
      {/* heading */}
      <div className="flex items-center gap-2 mb-4">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-9 rounded-xl"
            style={{ width: `${80 + (i % 3) * 24}px` } as React.CSSProperties}
          />
        ))}
      </div>
    </section>
  );
}

/* ─── Featured articles skeleton ─── */
export function FeaturedSkeleton() {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-5 w-5 rounded" />
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <FeaturedCardSkeleton />
        </div>
        <div className="flex flex-col gap-4">
          <ArticleCardSkeleton />
          <ArticleCardSkeleton />
        </div>
      </div>
    </section>
  );
}

/* ─── Latest articles grid skeleton ─── */
export function LatestArticlesSkeleton({ count = 8 }: { count?: number }) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-6 w-40" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   FULL HOME PAGE SKELETON
   Mirrors the layout of app/page.tsx exactly
   ───────────────────────────────────────────── */
export function HomePageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategorySkeleton count={6} />
        <FeaturedSkeleton />
        <LatestArticlesSkeleton count={8} />
      </div>
    </>
  );
}

/* ─── Admin dashboard skeleton ─── */
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl border border-[var(--border-color)] space-y-4"
            style={{ background: "var(--bg-surface)" }}
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <div className="space-y-1.5">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3.5 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="p-4 border-b border-[var(--border-color)]">
              <Skeleton className="h-5 w-32" />
            </div>
            <div className="p-5 space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex justify-between items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-7 w-12 rounded-lg" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Admin form skeleton ─── */
export function FormSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>

        <div className="w-full lg:w-80 space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-[var(--border-color)] space-y-4"
              style={{ background: "var(--bg-surface)" }}
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-10 w-full" />
              {i === 1 && <Skeleton className="h-10 w-full" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
