import Image from "next/image";
import { Globe } from "lucide-react";
import type { IAuthor } from "@/types";

export const GithubIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export const TwitterIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export const LinkedinIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

export function getSocialLinks(author: IAuthor) {
  return [
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
}

export function getAuthorBio(author: IAuthor) {
  return author.bio || `${author.name} is a technical writer contributing high-quality guides and tutorials on Learno-Boy.`;
}

interface AuthorAvatarProps {
  author: IAuthor;
  sizeClass?: string;
  shape?: "rounded" | "circle";
  sizes?: string;
  className?: string;
}

export function AuthorAvatar({
  author,
  sizeClass = "w-16 h-16",
  shape = "circle",
  sizes = "80px",
  className = "",
}: AuthorAvatarProps) {
  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className={`relative flex-shrink-0 ${sizeClass} ${roundedClass} overflow-hidden border border-[var(--border-color)] bg-[var(--bg-muted)] ${className}`}>
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          fill
          className="object-cover"
          sizes={sizes}
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-white text-base font-bold select-none"
          style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)", fontSize: sizeClass.includes("w-10") ? "11px" : "16px" }}
        >
          {author.name.slice(0, 2).toUpperCase()}
        </div>
      )}
    </div>
  );
}
