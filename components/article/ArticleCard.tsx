import Link from "next/link";
import Image from "next/image";
import { Clock, Calendar, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { IArticle, ICategory, IAuthor } from "@/types";
import { format } from "date-fns";

interface ArticleCardProps {
  article: IArticle;
  variant?: "default" | "featured" | "compact";
}

export function ArticleCard({ article, variant = "default" }: ArticleCardProps) {
  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;
  const author =
    typeof article.author === "object" ? (article.author as IAuthor) : null;

  const href = `/${category?.slug || "articles"}/${article.slug}`;

  if (variant === "compact") {
    return (
      <Link href={href} className="group flex gap-3 py-3 border-b border-[var(--border-color)] last:border-0">
        {article.coverImage && (
          <div className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {category && (
            <span className="text-xs font-medium" style={{ color: category.color }}>
              {category.name}
            </span>
          )}
          <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <span className="text-xs text-[var(--text-tertiary)]">
            {article.readingTime} min read
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={href}
        className="group relative block rounded-2xl overflow-hidden card-hover"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
        }}
      >
        {article.coverImage && (
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            {category && (
              <div className="absolute top-3 left-3">
                <Badge color={category.color}>{category.name}</Badge>
              </div>
            )}
          </div>
        )}
        <div className="p-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors line-clamp-2 mb-2 leading-snug">
            {article.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {author?.avatar && (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
              )}
              <span className="text-xs text-[var(--text-secondary)] font-medium">
                {author?.name || "Unknown"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {article.readingTime} min
              </span>
              <span className="flex items-center gap-1">
                <Eye size={11} />
                {article.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <article
      className="group rounded-xl card-hover"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <Link href={href} className="block p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          {category && (
            <Badge color={category.color} size="sm">
              <CategoryIcon icon={category.icon} className="mr-1" /> {category.name}
            </Badge>
          )}
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] flex-shrink-0">
            <Clock size={11} />
            <span>{article.readingTime} min read</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors line-clamp-2 mb-2 leading-snug">
          {article.title}
        </h2>

        <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4 leading-relaxed">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            {author?.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={22}
                height={22}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "var(--link-color)" }}
              >
                {author?.name?.[0] || "A"}
              </div>
            )}
            <span className="text-xs font-medium text-[var(--text-secondary)]">
              {author?.name || "Unknown"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <Calendar size={11} />
            <span>
              {article.publishedAt
                ? format(new Date(article.publishedAt), "MMM d, yyyy")
                : "Draft"}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
