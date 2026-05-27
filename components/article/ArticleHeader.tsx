import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import type { IArticle, ICategory, IAuthor, ITag } from "@/types";
import { format } from "date-fns";

interface ArticleHeaderProps {
  article: IArticle;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
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
          <div className="flex items-center gap-2.5">
            {author.avatar ? (
              <Image
                src={author.avatar}
                alt={author.name}
                width={36}
                height={36}
                className="rounded-full object-cover"
              />
            ) : (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)" }}
              >
                {author.name[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)] leading-none">
                {author.name}
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
          </div>
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
