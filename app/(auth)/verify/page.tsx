"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, ArrowLeft, MailCheck } from "lucide-react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setError("Verification token is missing. Please register again or request a new link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await fetch(`/api/auth/verify?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Verification failed. The token may be expired.");
          return;
        }

        setSuccess(true);
        setMessage(data.message || "Your email has been verified!");
      } catch {
        setError("A network error occurred. Please refresh or try again.");
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <div className="mb-8">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: "color-mix(in srgb, var(--link-color) 12%, var(--bg-surface))",
          }}
        >
          <MailCheck size={22} style={{ color: "var(--link-color)" }} />
        </div>
        <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Email Verification
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Confirming your identity on LearnoBoy.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Verifying your email address. Please hold on...
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium py-1.5 px-4 rounded-lg transition-all hover:underline"
            style={{ color: "var(--text-secondary)" }}
          >
            Do it later →
          </Link>
        </div>
      )}

      {!loading && error && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10 dark:border-red-900/40 flex items-start gap-3">
            <XCircle size={20} className="shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800 dark:text-red-400 mb-1">
                Verification Failed
              </p>
              <p className="text-xs text-red-700 dark:text-red-500 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <Link
              href="/signup"
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white text-center"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
              }}
            >
              Sign Up Again
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-1.5 text-sm font-medium py-2 hover:underline"
              style={{ color: "var(--text-secondary)" }}
            >
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      )}

      {!loading && success && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/40 flex items-start gap-3">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-1">
                Success!
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <button
            onClick={() => router.push("/login")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.01]"
            style={{
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            Proceed to Sign In
          </button>

          <Link
            href="/login"
            className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium border transition-all hover:opacity-80"
            style={{
              color: "var(--text-secondary)",
              borderColor: "var(--border-color, #e5e7eb)",
              background: "transparent",
            }}
          >
            Do it later
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 size={36} className="animate-spin text-blue-600" />
          <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
            Loading verification module...
          </p>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
