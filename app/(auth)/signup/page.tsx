"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2, AlertCircle, Check, X, ShieldCheck } from "lucide-react";


type Check = { label: string; pass: boolean };

function PasswordStrength({ password }: { password: string }) {
  const checks: Check[] = [
    { label: "8+ chars", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /[0-9]/.test(password) },
    { label: "Special (!@#…)", pass: /[^A-Za-z0-9]/.test(password) },
  ];

  const passed = checks.filter((c) => c.pass).length;
  const pct = (passed / checks.length) * 100;

  const barColor =
    passed <= 1 ? "#ef4444" : passed === 2 ? "#f59e0b" : passed === 3 ? "#3b82f6" : "#10b981";

  const label =
    passed <= 1 ? "Weak" : passed === 2 ? "Fair" : passed === 3 ? "Good" : "Strong";

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-2">
      {}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--border-color)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
        <span className="text-[11px] font-semibold w-12 text-right" style={{ color: barColor }}>
          {label}
        </span>
      </div>
      {}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {checks.map((c) => (
          <span
            key={c.label}
            className="flex items-center gap-1.5 text-[11px] transition-colors duration-200"
            style={{ color: c.pass ? "#10b981" : "var(--text-tertiary)" }}
          >
            {c.pass ? (
              <Check size={10} strokeWidth={3} className="shrink-0" />
            ) : (
              <X size={10} strokeWidth={2} className="shrink-0" />
            )}
            {c.label}
          </span>
        ))}
      </div>
    </div>
  );
}


function TermsCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group select-none">
      {}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{
          borderColor: checked ? "var(--link-color)" : "var(--border-color)",
          background: checked ? "var(--link-color)" : "transparent",
          boxShadow: checked ? "0 0 0 3px color-mix(in srgb, var(--link-color) 18%, transparent)" : "none",
        }}
      >
        {checked && <Check size={12} strokeWidth={3} color="#fff" />}
      </button>
      <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
        I have read and agree to the{" "}
        <Link
          href="/terms"
          target="_blank"
          className="font-semibold underline underline-offset-2"
          style={{ color: "var(--link-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          target="_blank"
          className="font-semibold underline underline-offset-2"
          style={{ color: "var(--link-color)" }}
          onClick={(e) => e.stopPropagation()}
        >
          Privacy Policy
        </Link>
        .
      </span>
    </label>
  );
}


function Field({
  id,
  label,
  value,
  type = "text",
  placeholder,
  autoComplete,
  required,
  onChange,
  rightSlot,
  error,
}: {
  id: string;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  onChange: (v: string) => void;
  rightSlot?: React.ReactNode;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-primary)" }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all duration-200"
          style={{
            background: "var(--bg-surface)",
            border: `1.5px solid ${
              error
                ? "#ef4444"
                : focused
                ? "var(--link-color)"
                : "var(--border-color)"
            }`,
            color: "var(--text-primary)",
            boxShadow: focused
              ? error
                ? "0 0 0 3px rgba(239,68,68,0.15)"
                : "0 0 0 3px color-mix(in srgb, var(--link-color) 15%, transparent)"
              : "none",
            paddingRight: rightSlot ? "2.75rem" : undefined,
          }}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs flex items-center gap-1 text-red-500">
          <X size={11} strokeWidth={2.5} />
          {error}
        </p>
      )}
    </div>
  );
}


export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPass, setShowPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsError, setTermsError] = useState(false);

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  const passwordsMatch = !form.confirm || form.password === form.confirm;
  const passRequirements =
    form.password.length >= 8 &&
    /[A-Z]/.test(form.password) &&
    /[0-9]/.test(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      setTermsError(true);
      return;
    }

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!passRequirements) {
      setError("Password must be at least 8 characters with an uppercase letter and a number.");
      return;
    }

    setLoading(true);
    setError("");
    setTermsError(false);

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

      window.location.href =
        data.role === "superadmin" || data.role === "writer" ? "/admin" : "/home";
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      {}
      <div className="mb-7">
        <h2 className="text-3xl font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>
          Create account
        </h2>
        <p className="mt-1.5 text-sm" style={{ color: "var(--text-secondary)" }}>
          Join LearnoBoy — it&apos;s free and takes under a minute.
        </p>
      </div>

      {}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 animate-fade-in">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {}
        <Field
          id="signup-name"
          label="Full name"
          value={form.name}
          autoComplete="name"
          required
          placeholder="Jane Smith"
          onChange={set("name")}
        />

        {}
        <Field
          id="signup-email"
          label="Email address"
          type="email"
          value={form.email}
          autoComplete="email"
          required
          placeholder="you@example.com"
          onChange={set("email")}
        />

        {}
        <div>
          <label
            htmlFor="signup-password"
            className="block text-sm font-medium mb-1.5"
            style={{ color: "var(--text-primary)" }}
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              required
              value={form.password}
              onChange={(e) => set("password")(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-3.5 py-2.5 pr-11 rounded-xl border text-sm outline-none transition-all duration-200"
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
          <PasswordStrength password={form.password} />
        </div>

        {}
        <Field
          id="signup-confirm"
          label="Confirm password"
          type={showPass ? "text" : "password"}
          value={form.confirm}
          autoComplete="new-password"
          required
          placeholder="Repeat password"
          onChange={set("confirm")}
          error={
            form.confirm && form.password !== form.confirm
              ? "Passwords don't match"
              : undefined
          }
        />

        {}
        <div className="pt-1">
          <TermsCheckbox checked={agreed} onChange={(v) => { setAgreed(v); if (v) setTermsError(false); }} />
          {termsError && (
            <p className="mt-1.5 text-xs flex items-center gap-1 text-red-500 animate-fade-in">
              <AlertCircle size={11} />
              You must agree to the Terms &amp; Conditions to continue.
            </p>
          )}
        </div>

        {}
        <button
          type="submit"
          disabled={loading || !passwordsMatch}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white mt-2 transition-all duration-200"
          style={{
            background:
              loading || !passwordsMatch
                ? "var(--text-tertiary)"
                : "linear-gradient(135deg, #2563eb, #4f46e5)",
            boxShadow:
              loading || !passwordsMatch
                ? "none"
                : "0 4px 14px rgba(37,99,235,0.35)",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ShieldCheck size={15} />
          )}
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
