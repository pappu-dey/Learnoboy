import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IArticle, ICategory, IAuthor, ITag } from "@/types";
import { format } from "date-fns";
import { ListenButton } from "@/components/article/ListenButton";

interface ArticleHeaderProps {
  article: IArticle;
  content?: string;
}

export function ArticleHeader({ article, content = "" }: ArticleHeaderProps) {
  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;
  const author =
    typeof article.author === "object" ? (article.author as IAuthor) : null;
  const tags =
    article.tags?.filter((t) => typeof t === "object") as ITag[] | undefined;

  return (
    <header className="mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-[var(--text-tertiary)] mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--link-color)] transition-colors">
          Home
        </Link>
        <span>/</span>
        {category && (
          <>
            <Link
              href={`/${category.slug}`}
              className="hover:text-[var(--link-color)] transition-colors"
            >
              {category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-[var(--text-secondary)] line-clamp-1 max-w-xs">
          {article.title}
        </span>
      </nav>

      {/* Category badge */}
      {category && (
        <Link href={`/${category.slug}`} className="inline-block mb-4">
          <Badge color={category.color} variant="subtle" size="md">
            <CategoryIcon icon={category.icon} className="mr-1.5" /> {category.name}
          </Badge>
        </Link>
      )}

      {/* Title */}
      <h1
        className="font-bold text-[var(--text-primary)] mb-4 leading-tight"
        style={{ fontSize: "clamp(28px, 5vw, 40px)" }}
      >
        {article.title}
      </h1>

      {/* Excerpt */}
      <p
        className="text-xl text-[var(--text-secondary)] mb-6 leading-relaxed"
        style={{ maxWidth: "65ch" }}
      >
        {article.excerpt}
      </p>

      {/* Meta row */}
      <div
        className="flex flex-wrap items-center gap-4 pb-6 border-b border-[var(--border-color)]"
      >
        {/* Author */}
        {author && (
          <Link
            href={`/author/${author.slug}`}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[var(--border-color)] flex-shrink-0">
              {author.avatar ? (
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}>
                  <svg viewBox="0 0 24 24" style={{ width: "55%", height: "55%", fill: "#fff", opacity: 0.9 }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-none group-hover:text-[var(--link-color)] transition-colors flex items-center gap-1.5">
                {author.name}
                {author.isVerified && <VerifiedBadge size="sm" showLabel={false} />}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                {(author.social?.twitter || author.social?.github || author.social?.linkedin) && (
                  <a
                    href={
                      author.social.github
                        ? `https://github.com/${author.social.github}`
                        : author.social.twitter
                        ? `https://twitter.com/${author.social.twitter}`
                        : author.social.linkedin || "#"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Author profile"
                  >
                    <ExternalLink size={11} className="text-[var(--text-tertiary)] hover:text-[var(--link-color)] transition-colors" />
                  </a>
                )}
              </div>
            </div>
          </Link>
        )}

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[var(--border-color)]" />

        {/* Date */}
        {article.publishedAt && (
          <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
            <Calendar size={13} />
            <time dateTime={article.publishedAt}>
              {format(new Date(article.publishedAt), "MMMM d, yyyy")}
            </time>
          </div>
        )}

        {/* Reading time */}
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <Clock size={13} />
          <span>{article.readingTime} min read</span>
        </div>

        {/* Views */}
        <div className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <Eye size={13} />
          <span>{article.views.toLocaleString()} views</span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-[var(--border-color)]" />

        {/* Listen button */}
        <ListenButton title={article.title} content={content} />
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {tags.map((tag) => (
            <Link key={tag._id} href={`/tag/${tag.slug}`}>
              <Badge variant="outline" color="var(--text-tertiary)" size="sm">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
