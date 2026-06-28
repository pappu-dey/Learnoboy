import Link from "next/link";
import { ArrowLeft, Search, Terminal, AlertCircle } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

export const metadata = {
  title: "Page Not Found | LearnoBoy",
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-md w-full px-6 text-center space-y-8 animate-fade-in">
        
        {}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-500/10 text-[var(--link-color)] flex items-center justify-center animate-pulse">
            <AlertCircle size={48} strokeWidth={1.5} />
          </div>
          <span className="absolute -bottom-2 font-mono text-2xl font-bold bg-[var(--bg-surface)] px-3 py-0.5 rounded-full border border-[var(--border-color)] text-[var(--text-primary)]">
            404
          </span>
        </div>

        {}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Lost in Space?
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            The page you are looking for does not exist, has been moved, or is temporarily unavailable. Let's get you back on track!
          </p>
        </div>

        {}
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
          <p className="text-xs font-semibold text-[var(--text-secondary)] text-left flex items-center gap-1.5">
            <Search size={12} style={{ color: "var(--link-color)" }} />
            Search LearnoBoy articles
          </p>
          <SearchBar compact />
        </div>

        {}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: "var(--link-color)" }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
          
          <Link
            href="/search"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-muted)] active:scale-95 cursor-pointer"
          >
            <Terminal size={15} />
            Explore Articles
          </Link>
        </div>

      </div>
    </div>
  );
}
