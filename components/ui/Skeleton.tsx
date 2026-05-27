interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = "", lines }: SkeletonProps) {
  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`animate-pulse rounded bg-[var(--bg-muted)] h-4 ${
              i === lines - 1 ? "w-3/4" : "w-full"
            }`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`animate-pulse rounded bg-[var(--bg-muted)] ${className}`}
    />
  );
}

export function ArticleCardSkeleton() {
  return (
    <div
      className="rounded-xl border border-[var(--border-color)] p-5 space-y-3"
      style={{ background: "var(--bg-surface)" }}
    >
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-6 w-4/5" />
      <Skeleton lines={3} />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}
