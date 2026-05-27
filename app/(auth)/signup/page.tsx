"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, AlertCircle, Check } from "lucide-react";

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase letter", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
  ];
  if (!password) return null;
  return (
    <div className="mt-2 flex gap-3">
      {checks.map((c) => (
        <span key={c.label} className="flex items-center gap-1 text-[11px]" style={{ color: c.pass ? "var(--link-color)" : "var(--text-tertiary)" }}>
          <Check size={10} strokeWidth={c.pass ? 3 : 1.5} />
          {c.label}
        </span>
      ))}
    </div>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed.");
        return;
      }

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

  const inputStyle = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
          Create account
        </h2>
        <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
          Join LearnoBoy — it&apos;s free.
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="signup-name" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Jane Smith"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Min. 8 characters"
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border-color)")}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded"
              style={{ color: "var(--text-tertiary)" }}
              tabIndex={-1}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <PasswordStrength password={form.password} />
        </div>

        {/* Confirm */}
        <div>
          <label htmlFor="signup-confirm" className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            required
            value={form.confirm}
            onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
            placeholder="Repeat password"
            className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{
              ...inputStyle,
              borderColor: form.confirm && form.password !== form.confirm ? "#ef4444" : "var(--border-color)",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--link-color)")}
            onBlur={(e) => (e.target.style.borderColor = form.confirm && form.password !== form.confirm ? "#ef4444" : "var(--border-color)")}
          />
          {form.confirm && form.password !== form.confirm && (
            <p className="mt-1 text-xs text-red-500">Passwords don&apos;t match</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 mt-2"
          style={{
            background: loading ? "var(--link-color)" : "linear-gradient(135deg, #2563eb, #4f46e5)",
            opacity: loading ? 0.75 : 1,
            boxShadow: "0 4px 14px rgba(37,99,235,0.35)",
          }}
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center" style={{ color: "var(--text-secondary)" }}>
        Already have an account?{" "}
        <Link href="/login" className="font-semibold" style={{ color: "var(--link-color)" }}>
          Sign in
        </Link>
      </p>
    </div>
  );
}
