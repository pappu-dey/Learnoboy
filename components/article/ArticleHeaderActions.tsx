"use client";

import { useState, useRef, useEffect } from "react";
import { Share2, Edit3, Link2, Check, Send, X, Loader2 } from "lucide-react";

// Custom SVG Icons because some Lucide packages lack social icons
const TwitterIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

interface ArticleHeaderActionsProps {
  articleId: string;
  articleTitle: string;
  inline?: boolean;
}

export function ArticleHeaderActions({ articleId, articleTitle, inline = false }: ArticleHeaderActionsProps) {
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  
  // Suggest Modal Form States
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this excellent article on LearnoBoy: "${articleTitle}"`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleSuggestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setSubmitError("Please write your suggestion first.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Content Suggestion",
          message: `[Article: ${articleTitle} (ID: ${articleId})]\n\n${message}`,
          email: email || undefined,
          articleId: articleId,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSubmitSuccess(true);
      setMessage("");
      setEmail("");
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestEditButton = (
    <button
      onClick={() => {
        setShowSuggestModal(true);
        setSubmitSuccess(false);
        setSubmitError("");
      }}
      className={
        inline
          ? "hover:text-[var(--link-color)] text-[var(--text-secondary)] transition-colors cursor-pointer flex items-center gap-1.5 font-semibold focus:outline-none"
          : "flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-color)] hover:border-[var(--link-color)] hover:text-[var(--link-color)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
      }
      title="Suggest Edit"
      aria-label="Suggest Edit"
    >
      <Edit3 size={inline ? 13 : 14} className="inline" />
      {inline ? <span>Suggest</span> : <span className="sr-only">Suggest Edit</span>}
    </button>
  );

  return (
    <>
      {inline ? (
        suggestEditButton
      ) : (
        <div className="flex items-center gap-2 md:gap-3 flex-wrap">
          {/* Share Button & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowShareDropdown(!showShareDropdown)}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--border-color)] hover:border-[var(--link-color)] hover:text-[var(--link-color)] bg-[var(--bg-base)] text-[var(--text-secondary)] transition-all cursor-pointer shadow-sm hover:shadow active:scale-95"
              aria-haspopup="true"
              aria-expanded={showShareDropdown}
              title="Share"
            >
              <Share2 size={14} />
            </button>

            {showShareDropdown && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-1.5 shadow-lg z-50 animate-fade-in" style={{ backdropFilter: "blur(8px)" }}>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Link2 size={13} />
                    <span>{copied ? "Copied!" : "Copy Link"}</span>
                  </div>
                  {copied && <Check size={13} className="text-green-500 animate-pulse" />}
                </button>
                <div className="my-1 border-t border-[var(--border-color)]" />
                <button
                  onClick={handleShareTwitter}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[#1DA1F2] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  <TwitterIcon size={13} />
                  <span>Share on X</span>
                </button>
                <button
                  onClick={handleShareLinkedIn}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[#0077B5] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                >
                  <LinkedinIcon size={13} />
                  <span>Share on LinkedIn</span>
                </button>
              </div>
            )}
          </div>

          {/* Suggest Change Button */}
          {suggestEditButton}
        </div>
      )}

      {/* Suggest Change Modal */}
      {showSuggestModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            className="bg-[var(--bg-base)] border border-[var(--border-color)] w-full max-w-lg rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            {/* Background Accent Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--link-color)]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border-color)] relative z-10">
              <h3 className="text-lg font-bold text-[var(--text-primary)]">Suggest a Change</h3>
              <button
                onClick={() => setShowSuggestModal(false)}
                className="p-1 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Form */}
            {!submitSuccess ? (
              <form onSubmit={handleSuggestSubmit} className="space-y-4 relative z-10">
                <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 text-xs text-[var(--text-secondary)] leading-relaxed">
                  💡 Notice an error or want to improve this article? Describe your suggestion below. The editorial team will review it shortly.
                </div>

                <div>
                  <label htmlFor="suggest-message" className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Your Suggestion <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="suggest-message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="E.g., In the code block under 'nested elements', the bold tag closing slash is missing... Or: Add a paragraph clarifying..."
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--link-color)] focus:outline-none transition-colors resize-y"
                  />
                </div>

                <div>
                  <label htmlFor="suggest-email" className="block text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    id="suggest-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@example.com"
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--link-color)] focus:outline-none transition-colors"
                  />
                  <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                    Providing an email lets us notify you when your suggestion is reviewed or implemented.
                  </p>
                </div>

                {submitError && (
                  <p className="text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/10 rounded-lg p-2.5">
                    ⚠️ {submitError}
                  </p>
                )}

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-color)]">
                  <button
                    type="button"
                    onClick={() => setShowSuggestModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] border border-[var(--border-color)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--link-color)] hover:bg-[var(--link-hover)] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Suggestion</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-4 relative z-10 animate-fade-in">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 animate-bounce">
                  <Check size={32} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[var(--text-primary)]">Suggestion Submitted!</h4>
                  <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                    Thank you! Your content suggestion has been successfully received and added to our review queue.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => setShowSuggestModal(false)}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[var(--link-color)] hover:bg-[var(--link-hover)] transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
