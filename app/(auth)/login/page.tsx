"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, LogIn } from "lucide-react";

export default function LoginPage() {
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

      
      if (data.role === "superadmin") {
        window.location.href = "/admin";
      } else if (data.role === "writer") {
        window.location.href = "/writer";
      } else {
        window.location.href = "/home";
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {}
      <div className="mb-8">
        <h2
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Welcome back
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
          Sign in to your LearnoBoy account to continue.
        </p>
      </div>

      {}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 animate-fade-in">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {}
        <InputField
          id="login-email"
          label="Email address"
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(v) => setForm((p) => ({ ...p, email: v }))}
          placeholder="you@example.com"
        />

        {}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold transition-colors duration-150"
              style={{ color: "var(--link-color)" }}
            >
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
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--bg-surface)",
                border: "1.5px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--link-color)";
                e.target.style.boxShadow =
                  "0 0 0 3px color-mix(in srgb, var(--link-color) 15%, transparent)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-[var(--bg-muted)]"
              style={{ color: "var(--text-tertiary)" }}
              tabIndex={-1}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {}
        <button
          type="submit"
          id="login-submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-1"
          style={{
            background: loading
              ? "var(--text-tertiary)"
              : "linear-gradient(135deg, #2563eb, #4f46e5)",
            boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <LogIn size={15} />
          )}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
        <span className="text-xs px-1" style={{ color: "var(--text-tertiary)" }}>
          New here?
        </span>
        <div className="flex-1 h-px" style={{ background: "var(--border-color)" }} />
      </div>

      <div className="mt-4">
        <Link
          href="/signup"
          className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 hover:bg-[var(--bg-muted)]"
          style={{ border: "1.5px solid var(--border-color)", color: "var(--text-primary)" }}
        >
          Create an account
        </Link>
      </div>
    </div>
  );
}


function InputField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  autoComplete,
  required,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-1.5"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--bg-surface)",
          border: "1.5px solid var(--border-color)",
          color: "var(--text-primary)",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "var(--link-color)";
          e.target.style.boxShadow =
            "0 0 0 3px color-mix(in srgb, var(--link-color) 15%, transparent)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "var(--border-color)";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}
