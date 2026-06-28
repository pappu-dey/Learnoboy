"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCcw, ShieldAlert, Terminal } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    
    console.error("[Unhandled Page Error Boundary]", error);
  }, [error]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-base)] py-16 transition-colors duration-300">
      <div className="max-w-md w-full px-6 text-center space-y-8 animate-fade-in">
        
        {}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center animate-pulse">
            <ShieldAlert size={48} strokeWidth={1.5} />
          </div>
          <span className="absolute -bottom-2 font-mono text-2xl font-bold bg-[var(--bg-surface)] px-3 py-0.5 rounded-full border border-red-200 dark:border-red-950 text-red-500">
            500
          </span>
        </div>

        {}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            An unexpected error occurred while rendering this page. Our technical team has been notified. Let's try reloading or going back home.
          </p>
        </div>

        {}
        {error.digest && (
          <div className="p-3.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-left font-mono text-[10px] text-[var(--text-tertiary)] overflow-x-auto">
            <span className="font-bold text-[var(--text-secondary)] block mb-1">Diagnostic ID:</span>
            {error.digest}
          </div>
        )}

        {}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            style={{ background: "var(--link-color)" }}
          >
            <RefreshCcw size={15} />
            Try Again
          </button>
          
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-muted)] active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
