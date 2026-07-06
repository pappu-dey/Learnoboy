import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

export const metadata = {
  title: "Page Not Found | LearnoBoy",
  description: "The page you are looking for does not exist or has been moved.",
};

function BrokenConnectionIllustration() {
  return (
    <svg
      width="100%"
      viewBox="0 0 680 420"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Broken connection illustration, 404 page not found"
    >
      {/* Big background 404 */}
      <text
        x="340"
        y="270"
        textAnchor="middle"
        fontSize="220"
        fontWeight="700"
        fill="var(--text-primary)"
        opacity="0.06"
      >
        404
      </text>

      <circle cx="170" cy="190" r="62" fill="var(--link-color)" opacity="0.08" />
      <circle cx="510" cy="190" r="62" fill="var(--text-secondary)" opacity="0.08" />

      <rect x="130" y="160" width="80" height="60" rx="8" fill="var(--link-color)" opacity="0.9" />
      <circle cx="148" cy="178" r="4" fill="var(--bg-surface)" />
      <circle cx="164" cy="178" r="4" fill="var(--bg-surface)" />
      <rect x="142" y="194" width="56" height="6" rx="3" fill="var(--bg-surface)" opacity="0.7" />
      <rect x="142" y="206" width="36" height="6" rx="3" fill="var(--bg-surface)" opacity="0.5" />

      <rect x="470" y="160" width="80" height="60" rx="8" fill="var(--text-secondary)" opacity="0.9" />
      <circle cx="488" cy="178" r="4" fill="var(--bg-surface)" />
      <circle cx="504" cy="178" r="4" fill="var(--bg-surface)" />
      <rect x="482" y="194" width="56" height="6" rx="3" fill="var(--bg-surface)" opacity="0.7" />
      <rect x="482" y="206" width="36" height="6" rx="3" fill="var(--bg-surface)" opacity="0.5" />

      <path d="M210 190 L 300 190" fill="none" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />
      <path d="M470 190 L 380 190" fill="none" stroke="var(--border-color)" strokeWidth="3" strokeLinecap="round" />

      <g transform="translate(300,190) rotate(-20)">
        <path d="M0 0 L 14 -10 L 4 0 L 14 10 Z" fill="#ef4444" />
      </g>
      <g transform="translate(380,190) rotate(160)">
        <path d="M0 0 L 14 -10 L 4 0 L 14 10 Z" fill="#ef4444" />
      </g>

      <circle cx="305" cy="160" r="2" fill="#ef4444" opacity="0.6" />
      <circle cx="295" cy="220" r="2.5" fill="#ef4444" opacity="0.6" />
      <circle cx="345" cy="145" r="1.5" fill="#ef4444" opacity="0.6" />
      <circle cx="375" cy="225" r="2" fill="#ef4444" opacity="0.6" />
      <circle cx="330" cy="235" r="1.5" fill="#ef4444" opacity="0.6" />
      <circle cx="355" cy="155" r="2" fill="#ef4444" opacity="0.6" />

      <text x="340" y="320" textAnchor="middle" fontSize="12" fill="var(--text-secondary)">
        connection lost
      </text>
    </svg>
  );
}

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-base)] px-4 py-16 transition-colors duration-300">
      <div className="max-w-md w-full text-center animate-fade-in">

        {/* Illustration */}
        <div className="mx-auto w-full max-w-[520px] mb-2 select-none">
          <BrokenConnectionIllustration />
        </div>

        {/* Heading */}
        <div className="space-y-2.5 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Lost in Space?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto">
            The page you're looking for doesn't exist, has moved, or is
            temporarily unavailable. Let's get you back on track.
          </p>
        </div>

        {/* Search module */}
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] mb-6 text-left">
          <p className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5 mb-3">
            <Search size={12} style={{ color: "var(--link-color)" }} />
            Search LearnoBoy articles
          </p>
          <SearchBar compact />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ background: "var(--link-color)" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <Link
            href="/search"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-muted)] active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Search size={16} />
            Search Articles
          </Link>
        </div>

      </div>
    </div>
  );
}