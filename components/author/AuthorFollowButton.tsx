"use client";

import { useState, useEffect, useRef } from "react";
import { UserPlus, UserCheck, X } from "lucide-react";

interface AuthorFollowButtonProps {
  slug: string;
  initialFollowers: number;
  isLoggedIn?: boolean;
}

function getFollowedSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem("followed_authors");
    if (raw) return new Set<string>(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set<string>();
}

function saveFollowedSlugs(slugs: Set<string>) {
  try {
    localStorage.setItem("followed_authors", JSON.stringify([...slugs]));
  } catch { /* ignore */ }
}

/* ─── Small floating toast ─── */
function LoginToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="absolute bottom-full mb-2 left-0 z-50 animate-fade-in whitespace-nowrap">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
      >
        <span>{message}</span>
        <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={11} />
        </button>
      </div>
      <div className="flex justify-start pl-4">
        <div
          className="w-2 h-2 rotate-45 border-b border-r -mt-1"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        />
      </div>
    </div>
  );
}

export function AuthorFollowButton({ slug, initialFollowers, isLoggedIn = false }: AuthorFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(initialFollowers);
  const [showToast, setShowToast] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch live follower count on mount (bypasses stale ISR cache)
  useEffect(() => {
    fetch(`/api/authors/${slug}/follow`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && typeof data.followers === "number") {
          setFollowers(data.followers);
        }
      })
      .catch(() => { /* keep initial */ });
  }, [slug]);

  // Load follow state from localStorage if logged in
  useEffect(() => {
    if (!isLoggedIn) return;
    const wasFollowing = getFollowedSlugs().has(slug);
    setIsFollowing(wasFollowing);

    if (wasFollowing) {
      const syncKey = `follow_synced_v2_${slug}`;
      if (!localStorage.getItem(syncKey)) {
        fetch(`/api/authors/${slug}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "follow" }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.success && typeof data.followers === "number") {
              setFollowers(data.followers);
              localStorage.setItem(syncKey, "true");
            }
          })
          .catch(() => { /* ignore */ });
      }
    }
  }, [slug, isLoggedIn]);

  const handleToggle = () => {
    if (!isLoggedIn) {
      setShowToast(true);
      return;
    }
    const newState = !isFollowing;
    const action = newState ? "follow" : "unfollow";

    const followed = getFollowedSlugs();
    if (newState) followed.add(slug);
    else followed.delete(slug);
    saveFollowedSlugs(followed);
    setIsFollowing(newState);
    setFollowers((prev) => Math.max(0, newState ? prev + 1 : prev - 1));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/authors/${slug}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.followers === "number") setFollowers(data.followers);
        }
      } catch { /* ignore */ }
    }, 500);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <button
          onClick={handleToggle}
          aria-pressed={isLoggedIn ? isFollowing : undefined}
          aria-label={isFollowing ? "Unfollow this author" : "Follow this author"}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer select-none active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-color)] ${
            isLoggedIn && isFollowing
              ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
              : "bg-[var(--link-color)] text-white border-[var(--link-color)] hover:bg-[var(--link-hover)]"
          }`}
        >
          {isLoggedIn && isFollowing ? (
            <><UserCheck size={16} className="animate-pulse" aria-hidden="true" /><span>Following</span></>
          ) : (
            <><UserPlus size={16} aria-hidden="true" /><span>Follow</span></>
          )}
        </button>
        {showToast && (
          <LoginToast
            message="Please sign in to follow"
            onDismiss={() => setShowToast(false)}
          />
        )}
      </div>

      {/* Follower count — always live from API */}
      <span className="text-sm text-[var(--text-secondary)] font-medium">
        <span className="font-bold text-[var(--text-primary)]">{followers.toLocaleString()}</span>{" "}
        {followers === 1 ? "follower" : "followers"}
      </span>
    </div>
  );
}
