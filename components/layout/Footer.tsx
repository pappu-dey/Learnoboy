"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";


const FOOTER_LINKS = {
  Learn: [
    { href: "/coding/javascript", label: "JavaScript" },
    { href: "/coding/python", label: "Python" },
    { href: "/dsa", label: "Data Structures" },
    { href: "/web-development", label: "Web Development" },
    { href: "/database", label: "Databases" },
  ],
  Platform: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
    { href: "/search", label: "Search Articles" },
    { href: "/donors", label: "Donors Leaderboard" },
  ],
  Playgrounds: [
    { href: "/compiler", label: "Online Compilers" },
    { href: "/compiler/html", label: "HTML/CSS/JS Sandbox" },
    { href: "/compiler", label: "Python Compiler" },
    { href: "/compiler", label: "Java Compiler" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookie-policy", label: "Cookie Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/editorial-policy", label: "Editorial Policy" },
  ],
};

const SOCIAL_LINKS = [
  {
    href: "https://github.com",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.089-.744.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .319.216.694.825.576C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter / X",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://linkedin.com",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

const FEEDBACK_TYPES = ["Bug Report", "Feature Request", "Content Suggestion", "General Feedback"];

const DONATE_AMOUNTS = [5, 10, 25, 50];


function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState(FEEDBACK_TYPES[3]);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isPending) return;

    setError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message: message.trim(), email }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to send feedback.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          animation: "slideUp 0.25s ease",
        }}
      >
        {submitted ? (
          <div className="text-center py-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "color-mix(in srgb, var(--link-color) 15%, transparent)" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--link-color)" strokeWidth="2.5" width="28" height="28">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
              Thank you!
            </h3>
            <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
              Your feedback helps us improve LearnoBoy for everyone.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: "var(--link-color)",
                color: "#fff",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                  Share Feedback
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-colors"
                style={{ color: "var(--text-tertiary)", background: "transparent" }}
                aria-label="Close"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {}
              <div className="flex flex-wrap gap-2">
                {FEEDBACK_TYPES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className="px-3 py-1 rounded-full text-xs font-medium transition-all border"
                    style={
                      type === t
                        ? {
                          background: "var(--link-color)",
                          color: "#fff",
                          borderColor: "var(--link-color)",
                        }
                        : {
                          background: "transparent",
                          color: "var(--text-secondary)",
                          borderColor: "var(--border-color)",
                        }
                    }
                  >
                    {t}
                  </button>
                ))}
              </div>

              {}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what's on your mind…"
                  className="w-full rounded-lg px-3 py-2.5 text-sm resize-none outline-none transition-all"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {}
              <div>
                <label
                  className="block text-xs font-medium mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email{" "}
                  <span style={{ color: "var(--text-tertiary)" }}>(optional, for follow-up)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-all"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {}
              {error && (
                <div className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-2.5 rounded-lg">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending || !message.trim()}
                className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ background: "var(--link-color)", color: "#fff" }}
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" width="16" height="16">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  "Send Feedback"
                )}
              </button>
            </form>
          </>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}


export function Footer() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <footer
        className="border-t border-[var(--border-color)] mt-20"
        style={{ background: "var(--bg-surface)" }}
      >
        {}
        <div
          className="border-b border-[var(--border-color)]"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--link-color) 6%, transparent), color-mix(in srgb, #f59e0b 5%, transparent))",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                Help us keep LearnoBoy free & growing 🚀
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                No ads, no paywalls — just great learning content.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowFeedback(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-[1.02]"
                style={{
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                  background: "var(--bg-surface)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Feedback
              </button>
              <Link
                href="/donors"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:scale-[1.02] hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  color: "#fff",
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 21.593c-.525-.327-3.695-2.366-5.865-4.55C3.915 14.788 2 12.41 2 9.5 2 6.462 4.462 4 7.5 4c1.59 0 3.09.748 4.5 2.25C13.41 4.748 14.91 4 16.5 4 19.538 4 22 6.462 22 9.5c0 2.91-1.916 5.288-4.135 7.543C15.695 19.227 12.525 21.266 12 21.593z" />
                </svg>
                Donate
              </Link>
            </div>
          </div>
        </div>

        {}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {}
            <div className="sm:col-span-2 md:col-span-1">
              <Link href="/" className="inline-flex mb-4">
                <Image
                  src="/images/logo.png"
                  alt="LearnoBoy"
                  width={120}
                  height={120}
                  style={{ height: "120px", width: "auto", borderRadius: "28%", objectFit: "contain" }}
                />
              </Link>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                A premium educational platform for developers, students, and technical readers.
              </p>
              <div className="flex items-center gap-2">
                {SOCIAL_LINKS.map(({ href, label, icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border transition-all duration-200"
                    style={{
                      borderColor: "var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>

            {}
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title}>
                <h3
                  className="font-semibold text-sm mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {title}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="text-sm transition-colors duration-200"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {}
          <div
            className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: "var(--border-color)" }}
          >
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              © {new Date().getFullYear()} LearnoBoy. All rights reserved.
            </p>

            {}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFeedback(true)}
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Feedback
              </button>
              <span style={{ color: "var(--border-color)" }}>·</span>
              <Link
                href="/donors"
                className="text-xs flex items-center gap-1 transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                ☕ Support us
              </Link>
            </div>

            <div className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-tertiary)" }}>
              <span>Made with</span>
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                width="14"
                height="14"
                className="text-red-500"
                aria-hidden="true"
              >
                <path d="M12 21.593c-.525-.327-3.695-2.366-5.865-4.55C3.915 14.788 2 12.41 2 9.5 2 6.462 4.462 4 7.5 4c1.59 0 3.09.748 4.5 2.25C13.41 4.748 14.91 4 16.5 4 19.538 4 22 6.462 22 9.5c0 2.91-1.916 5.288-4.135 7.543C15.695 19.227 12.525 21.266 12 21.593z" />
              </svg>
              <span>for learners everywhere</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}