import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IArticle, ICategory, IAuthor, ITag } from "@/types";
import { format } from "date-fns";
import { ListenButton } from "@/components/article/ListenButton";

function formatBreadcrumbText(text: string): string {
  if (!text) return "";
  
  const exceptions: Record<string, string> = {
    "dsa": "DSA",
    "html": "HTML",
    "css": "CSS",
    "js": "JS",
    "javascript": "JavaScript",
    "python": "Python",
    "react": "React",
    "nextjs": "Next.js",
    "nodejs": "Node.js",
    "expressjs": "Express.js",
    "dbms": "DBMS",
    "sql": "SQL",
    "mysql": "MySQL",
    "mongodb": "MongoDB",
    "postgresql": "PostgreSQL",
    "web-development": "Web Development",
    "data-structures": "Data Structures",
    "dynamic-programming": "Dynamic Programming",
    "javascript-fundamentals": "JavaScript Fundamentals",
    "interview-preparation": "Interview Preparation",
    "two-pointers": "Two Pointers",
    "sliding-window": "Sliding Window",
    "cyber-security": "Cyber Security",
    "machine-learning": "Machine Learning",
    "linked-list": "Linked List",
  };

  const lower = text.toLowerCase().trim();
  if (exceptions[lower]) return exceptions[lower];

  return text
    .split(/[-_\s]+/)
    .map((word) => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (exceptions[cleanWord]) {
        return exceptions[cleanWord] + word.slice(cleanWord.length);
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

interface ArticleHeaderProps {
  article: IArticle;
  content?: string;
}

export function ArticleHeader({ article, content = "" }: ArticleHeaderProps) {
  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;

  // Build deduplicated list of all categories
  const allCategories: ICategory[] = [];
  const seenIds = new Set<string>();
  // Start with the primary category
  if (category) {
    allCategories.push(category);
    seenIds.add(String(category._id));
  }
  // Add extra categories from the categories[] array
  if (Array.isArray(article.categories)) {
    for (const c of article.categories) {
      if (typeof c === "object" && c._id && !seenIds.has(String(c._id))) {
        allCategories.push(c as ICategory);
        seenIds.add(String(c._id));
      }
    }
  }

  const author =
    typeof article.author === "object" ? (article.author as IAuthor) : null;
  const tags =
    article.tags?.filter((t) => typeof t === "object") as ITag[] | undefined;

  return (
    <header className="mb-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs md:text-sm text-[var(--text-tertiary)] mb-6 font-medium" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--link-color)] transition-colors">
          Home
        </Link>
        <span className="opacity-60 text-xs font-normal">&gt;</span>
        {article.primaryCategory && (
          <>
            <Link
              href={`/${article.primaryCategory}`}
              className="hover:text-[var(--link-color)] transition-colors"
            >
              {formatBreadcrumbText(article.primaryCategory)}
            </Link>
            <span className="opacity-60 text-xs font-normal">&gt;</span>
          </>
        )}
        {article.subcategory && (
          <>
            <Link
              href={`/${article.primaryCategory}/${article.subcategory}`}
              className="hover:text-[var(--link-color)] transition-colors"
            >
              {formatBreadcrumbText(article.subcategory)}
            </Link>
            <span className="opacity-60 text-xs font-normal">&gt;</span>
          </>
        )}
        <span className="text-[var(--text-secondary)] font-semibold line-clamp-1 max-w-xs md:max-w-md">
          {formatBreadcrumbText(article.title)}
        </span>
      </nav>

      {/* Category badges — supports multiple */}
      {allCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allCategories.map((cat) => (
            <Link key={cat._id} href={`/${cat.slug}`} className="inline-block">
              <Badge color={cat.color} variant="subtle" size="md">
                <CategoryIcon icon={cat.icon} className="mr-1.5" /> {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
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
