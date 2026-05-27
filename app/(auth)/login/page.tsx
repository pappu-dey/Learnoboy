"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed.");
        return;
      }

      // Redirect based on role
      if (data.role === "superadmin" || data.role === "writer") {
        router.push("/admin");
      } else {
        router.push("/");
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Welcome back
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Sign in to your LearnoBoy account
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Password
            </label>
            <Link href="/forgot-password" className="text-xs font-medium" style={{ color: "var(--link-color)" }}>
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors"
              style={{ color: "var(--text-tertiary)" }}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: loading ? "var(--link-color)" : "linear-gradient(135deg, #2563eb, #4f46e5)",
            opacity: loading ? 0.75 : 1,
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {/* Divider */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>New here?</span>
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
      </div>

      <div className="mt-4">
        <Link
          href="/signup"
          className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:bg-[var(--bg-muted)]"
          style={{ border: "1px solid var(--border-color)", color: "var(--text-primary)" }}
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}
