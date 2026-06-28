import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, Eye, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IArticle, ICategory, IAuthor, ITag } from "@/types";
import { format } from "date-fns";
import { ListenButton } from "@/components/article/ListenButton";
import { ArticleHeaderActions } from "@/components/article/ArticleHeaderActions";

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

  
  const allCategories: ICategory[] = [];
  const seenIds = new Set<string>();
  
  if (category) {
    allCategories.push(category);
    seenIds.add(String(category._id));
  }
  
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
      {}
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
            <span className="opacity-60 text-xs font-normal" aria-hidden="true">&gt;</span>
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
            <span className="opacity-60 text-xs font-normal" aria-hidden="true">&gt;</span>
          </>
        )}
        <span
          className="text-[var(--text-secondary)] font-semibold line-clamp-2 max-w-xs md:max-w-md"
          title={article.title}
        >
          {formatBreadcrumbText(article.title)}
        </span>
      </nav>

      {}
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

      {}
      <h1
        className="font-extrabold text-[var(--text-primary)] mb-3 leading-tight tracking-tight"
        style={{ fontSize: "clamp(22px, 5vw, 42px)" }}
      >
        {article.title}
      </h1>

      {}
      {(() => {
        const dateToShow = article.updatedAt || article.publishedAt || article.createdAt;
        const formattedDate = dateToShow ? format(new Date(dateToShow), "d/M/yyyy") : "20/4/2026";

        return (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs md:text-sm text-[var(--text-secondary)] font-medium mb-6">
            <span>Updated: {formattedDate}</span>
            <span className="opacity-40" aria-hidden="true">•</span>
            <ListenButton title={article.title} content={content} variant="button" size="small" />
            <span className="opacity-40" aria-hidden="true">•</span>
            <span>{article.readingTime || 3} min read</span>
            <span className="opacity-40" aria-hidden="true">•</span>
            <span>{(article.views || 0).toLocaleString()} views</span>
            <span className="opacity-40" aria-hidden="true">•</span>
            <ArticleHeaderActions articleId={String(article._id)} articleTitle={article.title} inline={true} />
          </div>
        );
      })()}

      {}
      {article.excerpt && (
        <p
          className="text-base md:text-lg text-[var(--text-secondary)] mb-6 leading-relaxed max-w-[72ch]"
        >
          {article.excerpt}
        </p>
      )}
    </header>
  );
}
