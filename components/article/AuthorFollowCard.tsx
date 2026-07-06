"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { UserPlus, UserCheck, Users, X } from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IAuthor } from "@/types";
import { AuthorAvatar } from "./AuthorPrimitives";
import { getClientSession } from "@/lib/auth/clientSession";

interface AuthorFollowCardProps {
  author: IAuthor;
  readingTime?: number;
  views?: number;
  isLoggedIn?: boolean;
}

function getFollowedSlugs(): Set<string> {
  try {
    const raw = localStorage.getItem("followed_authors");
    if (raw) return new Set<string>(JSON.parse(raw));
  } catch {  }
  return new Set<string>();
}

function saveFollowedSlugs(slugs: Set<string>) {
  try {
    localStorage.setItem("followed_authors", JSON.stringify([...slugs]));
  } catch {  }
}


function LoginToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 2500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="absolute bottom-full mb-2 right-0 z-50 animate-fade-in whitespace-nowrap">
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold shadow-lg border"
        style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
      >
        <span>{message}</span>
        <button onClick={onDismiss} className="opacity-50 hover:opacity-100 transition-opacity">
          <X size={11} />
        </button>
      </div>
      <div className="flex justify-end pr-4">
        <div
          className="w-2 h-2 rotate-45 border-b border-r -mt-1"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        />
      </div>
    </div>
  );
}

export function AuthorFollowCard({ author, isLoggedIn = false }: AuthorFollowCardProps) {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(isLoggedIn);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const [followers, setFollowers] = useState<number>(author.followers ?? 0);
  const [showToast, setShowToast] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      setIsUserLoggedIn(true);
    } else {
      getClientSession().then((user) => {
        if (user) setIsUserLoggedIn(true);
      });
    }
  }, [isLoggedIn]);

  
  useEffect(() => {
    fetch(`/api/authors/${author.slug}/follow`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && typeof data.followers === "number") {
          setFollowers(data.followers);
        }
      })
      .catch(() => {  });
  }, [author.slug]);

  
  useEffect(() => {
    if (!isUserLoggedIn) return;
    const wasFollowing = getFollowedSlugs().has(author.slug);
    setIsFollowing(wasFollowing);

    if (wasFollowing) {
      const syncKey = `follow_synced_v2_${author.slug}`;
      if (!localStorage.getItem(syncKey)) {
        fetch(`/api/authors/${author.slug}/follow`, {
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
          .catch(() => {  });
      }
    }
  }, [author.slug, isUserLoggedIn]);

  const handleFollowToggle = () => {
    if (!isUserLoggedIn) {
      setShowToast(true);
      return;
    }
    const newState = !isFollowing;
    const action = newState ? "follow" : "unfollow";

    const followed = getFollowedSlugs();
    if (newState) followed.add(author.slug);
    else followed.delete(author.slug);
    saveFollowedSlugs(followed);
    setIsFollowing(newState);
    setFollowers((prev) => Math.max(0, newState ? prev + 1 : prev - 1));

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/authors/${author.slug}/follow`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && typeof data.followers === "number") {
            setFollowers(data.followers);
          }
        }
      } catch {  }
    }, 500);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <section className="mt-8 pt-6 border-t border-[var(--border-color)]" aria-label="About the author">
      <div
        className="rounded-2xl border border-[var(--border-color)] p-4 sm:p-5 transition-all duration-300 hover:shadow-sm"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="flex items-center justify-between gap-4">
          {}
          <div className="flex items-center gap-4 min-w-0">
            <Link href={`/author/${author.slug}`} className="relative flex-shrink-0" aria-label={`View ${author.name}'s profile`}>
              <AuthorAvatar author={author} sizeClass="w-12 h-12 sm:w-14 sm:h-14" shape="circle" sizes="56px" />
              {author.isVerified && (
                <span className="absolute -bottom-1 -right-1 bg-[var(--bg-base)] rounded-full p-0.5 border border-[var(--border-color)] shadow-sm">
                  <VerifiedBadge size="sm" showLabel={false} />
                </span>
              )}
            </Link>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/author/${author.slug}`}
                  className="text-base sm:text-lg font-bold text-[var(--text-primary)] hover:text-[var(--link-color)] transition-colors truncate"
                >
                  {author.name}
                </Link>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-[var(--link-color)]/10 text-[var(--link-color)] flex-shrink-0">
                  Author
                </span>
              </div>
              {}
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--text-tertiary)] font-medium">
                <Users size={11} aria-hidden="true" />
                <span>{followers.toLocaleString()} {followers === 1 ? "follower" : "followers"}</span>
                {isUserLoggedIn && isFollowing && (
                  <>
                    <span className="opacity-40">•</span>
                    <span className="text-green-600 font-semibold">You follow this author</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {}
          <div className="relative flex-shrink-0">
            <button
              onClick={handleFollowToggle}
              aria-pressed={isUserLoggedIn ? isFollowing : undefined}
              aria-label={isFollowing ? `Unfollow ${author.name}` : `Follow ${author.name}`}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer select-none active:scale-95 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--link-color)] ${
                isUserLoggedIn && isFollowing
                  ? "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20"
                  : "bg-[var(--link-color)] text-white border-[var(--link-color)] hover:bg-[var(--link-hover)]"
              }`}
            >
              {isUserLoggedIn && isFollowing ? (
                <>
                  <UserCheck size={13} className="animate-pulse" aria-hidden="true" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus size={13} aria-hidden="true" />
                  <span>Follow</span>
                </>
              )}
            </button>
            {showToast && (
              <LoginToast
                message="Please sign in to follow"
                onDismiss={() => setShowToast(false)}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
