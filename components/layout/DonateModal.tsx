"use client";

import { useState } from "react";
import Image from "next/image";

interface DonateModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function DonateModal({ onClose, onSuccess }: DonateModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [isPending, setIsPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !amount.trim() || isPending) return;

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      setError("Please enter a donation amount of at least Rp 1.");
      return;
    }

    setError(null);
    setIsPending(true);

    try {
      const res = await fetch("/api/donors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          amount: numericAmount,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to register donation.");
      } else {
        setSubmitted(true);
        if (onSuccess) {
          onSuccess();
        }
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl relative my-8"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border-color)",
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--bg-muted)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 scale-up-success"
              style={{
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.15) 100%)",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--link-color, #10b981)" strokeWidth="3" width="32" height="32">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-[var(--text-primary)]">
              Thank you, {name}!
            </h3>

            <p className="text-sm mb-6 leading-relaxed text-[var(--text-secondary)]">
              Your details along with donation of <strong className="text-[var(--text-primary)]">Rp {Number(amount).toLocaleString("id-ID")}</strong> have been successfully submitted for verification. Once verified by our team, your donation will appear publicly on our leaderboard!
            </p>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 text-white"
              style={{
                background: "var(--link-color, #2563eb)",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <div>
            {}
            <div className="mb-4 pr-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
                <span>💖</span> Support LearnoBoy
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Scan the QR code to donate.
              </p>
            </div>

            {}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl mb-4 border border-[var(--border-color)] bg-[var(--bg-base)]">
              <div className="relative w-64 h-64 rounded-xl overflow-hidden shadow-md border-2 border-white dark:border-zinc-800 transition-all duration-300 hover:scale-[1.02]">
                <Image
                  src="/images/qrcode.jpeg"
                  alt="Donation QR Code"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider mt-2.5 text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                Scan to Pay
              </span>
            </div>

            {}
            <form onSubmit={handleSubmit} className="space-y-4">
              {}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  Donation Amount (Rp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-tertiary)]">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 50000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-xl pl-9 pr-3 py-2 text-xs outline-none bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--link-color)] transition-all"
                  />
                </div>
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs outline-none transition-all"
                  style={{
                    background: "var(--bg-base)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {}
              {error && (
                <div className="text-[11px] text-red-500 font-semibold bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-2.5 rounded-xl">
                  ⚠️ {error}
                </div>
              )}

              {}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] bg-transparent hover:bg-[var(--bg-muted)] transition-colors active:scale-95"
                >
                  Close
                </button>

                <button
                  type="submit"
                  disabled={isPending || !name.trim() || !email.trim() || !amount.trim()}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
                  style={{
                    background: "var(--link-color, #2563eb)",
                    color: "#ffffff",
                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                  }}
                >
                  {isPending ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    "Submit Details"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .scale-up-success {
          animation: scaleUpSuccess 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes scaleUpSuccess {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
