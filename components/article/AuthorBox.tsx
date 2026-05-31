import Link from "next/link";
import Image from "next/image";
import { Globe, FileText, Eye, ExternalLink } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IAuthor } from "@/types";

interface AuthorBoxProps {
  author: IAuthor;
  articleCount?: number;
}

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

export function AuthorBox({ author, articleCount }: AuthorBoxProps) {
  const count = articleCount ?? author.articleCount ?? 0;

  const socialLinks = [
    { href: author.social?.github ? `https://github.com/${author.social.github}` : null, icon: <GithubIcon />, label: "GitHub" },
    { href: author.social?.twitter ? `https://twitter.com/${author.social.twitter}` : null, icon: <TwitterIcon />, label: "Twitter" },
    {
      href: author.social?.linkedin
        ? author.social.linkedin.startsWith("http")
          ? author.social.linkedin
          : `https://linkedin.com/in/${author.social.linkedin}`
        : null,
      icon: <LinkedinIcon />,
      label: "LinkedIn",
    },
    {
      href: author.social?.website
        ? author.social.website.startsWith("http")
          ? author.social.website
          : `https://${author.social.website}`
        : null,
      icon: <Globe size={14} />,
      label: "Website",
    },
  ].filter((s) => s.href);

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
        {/* Avatar */}
        <Link
          href={`/author/${author.slug}`}
          className="flex-shrink-0 self-start"
          aria-label={`View ${author.name}'s profile`}
        >
          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-muted)] hover:opacity-90 transition-opacity">
            {author.avatar ? (
              <Image src={author.avatar} alt={author.name} fill className="object-cover" sizes="80px" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-xl font-bold"
                style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
              >
                {author.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Name + verified */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              href={`/author/${author.slug}`}
              className="text-lg font-bold text-[var(--text-primary)] hover:text-[var(--link-color)] transition-colors"
            >
              {author.name}
            </Link>
            {author.isVerified && <VerifiedBadge size="sm" />}
          </div>

          {/* Expertise chips */}
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

          {/* Bio */}
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3 line-clamp-3">
            {author.bio || `${author.name} is a technical writer contributing high-quality guides and tutorials on Learno-Boy.`}
          </p>

          {/* Stats + social */}
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

            {/* Social icons */}
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

            {/* View profile CTA */}
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
