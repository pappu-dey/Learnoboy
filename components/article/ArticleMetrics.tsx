"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Heart, Share2, MessageSquare, Link2, Check, X } from "lucide-react";
import type { IArticle } from "@/types";

interface ArticleMetricsProps {
  article: IArticle;
  isLoggedIn?: boolean;
}


function LoginToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 animate-fade-in whitespace-nowrap">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        <span>{message}</span>
        <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={11} />
        </button>
      </div>
      {}
      <div className="flex justify-center">
        <div
          className="w-2 h-2 rotate-45 border-b border-r -mt-1"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        />
      </div>
    </div>
  );
}


const TwitterIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const LinkedinIcon = ({ size = 13 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" fill="currentColor" />
  </svg>
);

export function ArticleMetrics({ article, isLoggedIn = false }: ArticleMetricsProps) {
  const [likes, setLikes] = useState(article.likes || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [showShareDropdown, setShowShareDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [discussOpen, setDiscussOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  
  const [likeToast, setLikeToast] = useState(false);
  const [discussToast, setDiscussToast] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const likeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  useEffect(() => {
    if (!isLoggedIn) return;
    if (localStorage.getItem(`like_article_${article.slug}`) === "true") {
      setHasLiked(true);
    }
  }, [article.slug, isLoggedIn]);

  
  useEffect(() => {
    const handleToggle = () => setDiscussOpen((prev) => !prev);
    window.addEventListener("toggle-discussion", handleToggle);
    return () => window.removeEventListener("toggle-discussion", handleToggle);
  }, []);

  
  useEffect(() => {
    const handleCount = (e: Event) => {
      const ev = e as CustomEvent<{ count: number }>;
      if (typeof ev.detail?.count === "number") setCommentCount(ev.detail.count);
    };
    window.addEventListener("comment-count-changed", handleCount);
    return () => window.removeEventListener("comment-count-changed", handleCount);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowShareDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const syncLikeToApi = useCallback((id: string, increment: boolean) => {
    if (likeDebounceRef.current) clearTimeout(likeDebounceRef.current);
    likeDebounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/articles/${id}/like`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ increment }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.likes === "number") setLikes(data.likes);
        }
      } catch (err) {
        console.error("Failed to sync like:", err);
      }
    }, 600);
  }, []);

  const handleLikeToggle = () => {
    if (!isLoggedIn) {
      setLikeToast(true);
      return;
    }
    const nextLiked = !hasLiked;
    setHasLiked(nextLiked);
    setLikes((prev) => Math.max(0, nextLiked ? prev + 1 : prev - 1));
    localStorage.setItem(`like_article_${article.slug}`, String(nextLiked));
    syncLikeToApi(article._id, nextLiked);
  };

  const handleScrollToDiscuss = () => {
    
    window.dispatchEvent(new CustomEvent("toggle-discussion"));
    if (!discussOpen) {
      setTimeout(() => {
        document.getElementById("comments-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  };

  useEffect(() => () => { if (likeDebounceRef.current) clearTimeout(likeDebounceRef.current); }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {  }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this article on LearnoBoy: "${article.title}"`);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="mt-6 pt-6 border-t border-[var(--border-color)]">
      <div className="flex items-center gap-3.5 text-xs md:text-sm text-[var(--text-secondary)] font-medium p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] w-fit max-w-full relative">

        {}
        <div className="relative">
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer select-none active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-color)] rounded ${
              isLoggedIn && hasLiked
                ? "text-red-500 font-bold"
                : "hover:text-red-500 text-[var(--text-secondary)]"
            }`}
            aria-label={hasLiked ? "Unlike article" : "Like article"}
            aria-pressed={isLoggedIn ? hasLiked : undefined}
          >
            <Heart size={14} fill={isLoggedIn && hasLiked ? "currentColor" : "none"} aria-hidden="true" />
            <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
          </button>
          {likeToast && (
            <LoginToast
              message="Please sign in to like"
              onDismiss={() => setLikeToast(false)}
            />
          )}
        </div>

        <span className="opacity-40 text-xs" aria-hidden="true">•</span>

        {}
        <div className="relative inline-block" ref={dropdownRef}>
          <button
            onClick={() => setShowShareDropdown(!showShareDropdown)}
            className="hover:text-[var(--link-color)] transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-color)] rounded"
            aria-haspopup="true"
            aria-expanded={showShareDropdown}
            aria-label="Share article"
          >
            <Share2 size={14} aria-hidden="true" />
            <span>Share</span>
          </button>

          {showShareDropdown && (
            <div
              role="menu"
              className="absolute left-0 mt-2 w-48 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-1.5 shadow-lg z-50 animate-fade-in"
              style={{ backdropFilter: "blur(8px)" }}
            >
              <button
                role="menuitem"
                onClick={handleCopyLink}
                className="flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Link2 size={13} aria-hidden="true" />
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </div>
                {copied && <Check size={13} className="text-green-500 animate-pulse" aria-hidden="true" />}
              </button>
              <div className="my-1 border-t border-[var(--border-color)]" />
              <button
                role="menuitem"
                onClick={handleShareTwitter}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[#1DA1F2] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                <TwitterIcon size={13} />
                <span>Share on X</span>
              </button>
              <button
                role="menuitem"
                onClick={handleShareLinkedIn}
                className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-[var(--text-secondary)] hover:text-[#0077B5] hover:bg-[var(--bg-muted)] transition-colors cursor-pointer"
              >
                <LinkedinIcon size={13} />
                <span>Share on LinkedIn</span>
              </button>
            </div>
          )}
        </div>

        <span className="opacity-40 text-xs" aria-hidden="true">•</span>

        {}
        <div className="relative">
          <button
            onClick={handleScrollToDiscuss}
            className={`flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-color)] rounded ${
              discussOpen ? "text-[var(--link-color)] font-bold" : "hover:text-[var(--link-color)]"
            }`}
            aria-pressed={discussOpen}
            aria-label={discussOpen ? "Close discussion" : "Open discussion"}
          >
            <MessageSquare size={14} aria-hidden="true" />
            <span>Discuss{commentCount > 0 ? ` ${commentCount}` : ""}</span>
          </button>
          {discussToast && (
            <LoginToast
              message="Please sign in to comment"
              onDismiss={() => setDiscussToast(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
