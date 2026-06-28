import Link from "next/link";
import { FileText, Eye, ExternalLink } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IAuthor } from "@/types";
import { AuthorAvatar, getSocialLinks, getAuthorBio } from "./AuthorPrimitives";

interface AuthorBoxProps {
  author: IAuthor;
  articleCount?: number;
}

export function AuthorBox({ author, articleCount }: AuthorBoxProps) {
  const count = articleCount ?? author.articleCount ?? 0;
  const socialLinks = getSocialLinks(author);

  return (
    <div
      className="mt-12 mb-8 p-6 rounded-2xl border border-[var(--border-color)]"
      style={{ background: "var(--bg-surface)" }}
      aria-label="About the author"
    >
      <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-4">
        About the Author
      </p>

      <div className="flex flex-col sm:flex-row gap-5">
        {}
        <Link
          href={`/author/${author.slug}`}
          className="flex-shrink-0 self-start"
          aria-label={`View ${author.name}'s profile`}
        >
          <AuthorAvatar
            author={author}
            sizeClass="w-20 h-20"
            shape="rounded"
            sizes="80px"
          />
        </Link>

        {}
        <div className="flex-1 min-w-0">
          {}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/author/${author.slug}`}
              className="text-lg font-bold text-[var(--text-primary)] hover:text-[var(--link-color)] transition-colors"
            >
              {author.name}
            </Link>
            {author.isVerified && <VerifiedBadge size="sm" />}
          </div>

          {}
          {(author.expertise?.length ?? 0) > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {author.expertise!.slice(0, 4).map((exp) => (
                <span
                  key={exp}
                  className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{ background: "rgba(37,99,235,0.08)", color: "var(--link-color)" }}
                >
                  {exp}
                </span>
              ))}
            </div>
          )}

          {}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
            {getAuthorBio(author)}
          </p>

          {}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <span className="flex items-center gap-1">
                <FileText size={11} className="text-[var(--link-color)]" />
                {count} {count === 1 ? "article" : "articles"}
              </span>
              {author.totalViews > 0 && (
                <span className="flex items-center gap-1">
                  <Eye size={11} className="text-[var(--link-color)]" />
                  {author.totalViews.toLocaleString()} views
                </span>
              )}
            </div>

            {}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-1.5">
                {socialLinks.map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            )}

            {}
            <Link
              href={`/author/${author.slug}`}
              className="ml-auto flex items-center gap-1 text-xs font-semibold text-[var(--link-color)] hover:opacity-80 transition-opacity"
            >
              <ExternalLink size={12} />
              View all articles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
