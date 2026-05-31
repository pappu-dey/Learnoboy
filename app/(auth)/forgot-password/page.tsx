"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, AlertCircle, Mail, Copy, Check, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resetUrl, setResetUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResetUrl("");
    setSuccess(false);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Request failed.");
        return;
      }
      setSuccess(true);
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <Link href="/login" className="inline-flex items-center gap-1.5 text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        <ArrowLeft size={14} /> Back to sign in
      </Link>

      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--link-color) 12%, var(--bg-surface))" }}>
          <Mail size={22} style={{ color: "var(--link-color)" }} />
        </div>
        <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Forgot password?
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Enter your email and we&apos;ll generate a reset link for you.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800 flex items-start gap-3">
            <CheckCircle2 size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400 mb-1">Email Sent!</p>
              <p className="text-xs text-emerald-700 dark:text-emerald-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, a recovery link has been sent to your email address. Please check your inbox and spam folder.
              </p>
            </div>
          </div>

          {resetUrl && (
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-1">Development Mode Link:</p>
              <p className="text-xs text-blue-600 dark:text-blue-500 mb-3">Copy this simulated link to open directly in your browser:</p>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-950/30">
                <p className="flex-1 text-xs font-mono text-blue-800 dark:text-blue-300 truncate">{resetUrl}</p>
                <button
                  onClick={handleCopy}
                  className="shrink-0 flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: copied ? "var(--link-color)" : "var(--bg-muted)", color: copied ? "#fff" : "var(--text-primary)" }}
                >
                  {copied ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => { setSuccess(false); setResetUrl(""); setEmail(""); }}
            className="text-sm font-medium" style={{ color: "var(--link-color)" }}
          >
            Try another email
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #2563eb, #4f46e5)",
              opacity: loading ? 0.75 : 1,
              boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
            }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Generating…" : "Generate reset link"}
          </button>
        </form>
      )}
    </div>
  );
}
