"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";

function ResetForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords do not match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Reset failed."); return; }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: "color-mix(in srgb, var(--link-color) 12%, var(--bg-surface))" }}>
          <KeyRound size={22} style={{ color: "var(--link-color)" }} />
        </div>
        <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>Reset password</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>Choose a strong new password.</p>
      </div>

      {!token && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
          Invalid or missing reset token. Please request a new{" "}
          <Link href="/forgot-password" style={{ color: "var(--link-color)" }}>forgot password link</Link>.
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800 flex items-center gap-3 text-sm text-emerald-700 dark:text-emerald-400">
          <CheckCircle2 size={18} className="shrink-0" />
          Password updated! Redirecting to sign in…
        </div>
      ) : token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rp-password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>New password</label>
            <div className="relative">
              <input id="rp-password" type={showPass ? "text" : "password"} required value={password}
                onChange={(e) => setPassword(e.target.value)} placeholder="Min. 8 characters"
                className="w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm outline-none"
                style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
                onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--text-tertiary)" }} tabIndex={-1}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="rp-confirm" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>Confirm password</label>
            <input id="rp-confirm" type={showPass ? "text" : "password"} required value={confirm}
              onChange={(e) => setConfirm(e.target.value)} placeholder="Repeat password"
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")} />
          </div>
          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", opacity: loading ? 0.75 : 1, boxShadow: "0 4px 14px rgba(37,99,235,0.35)" }}>
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      ) : null}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  );
}
