"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Heart,
  Clock,
  LogIn,
  Loader2,
  AlertCircle,
  MessageCircleOff,
} from "lucide-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { IAuthor } from "@/types";


interface Reply {
  _id: string;
  authorName: string;
  authorAvatar?: string;
  role?: string;
  isArticleAuthor?: boolean;
  content: string;
  createdAt: string;
  likes: number;
  likedByUser?: boolean;
}

interface Comment {
  _id: string;
  authorName: string;
  authorAvatar?: string;
  role?: string;
  isArticleAuthor?: boolean;
  content: string;
  createdAt: string;
  likes: number;
  likedByUser: boolean;
  replies?: Reply[];
}

interface ArticleCommentsProps {
  articleId: string;
  author: IAuthor;
  readingTime: number;
  views: number;
  hideHeader?: boolean;
  defaultOpen?: boolean;
  isLoggedIn?: boolean;
}


function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Avatar({ name, avatar, size = 8 }: { name: string; avatar?: string; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full overflow-hidden border border-[var(--border-color)] flex-shrink-0 bg-[var(--bg-muted)]`;
  if (avatar) {
    return (
      <div className={`relative ${cls}`}>
        <Image src={avatar} alt={name} fill className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`${cls} flex items-center justify-center text-white text-[11px] font-bold`}
      style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
    >
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}


export function ArticleComments({
  articleId,
  author,
  readingTime,
  views,
  hideHeader = false,
  defaultOpen = false,
  isLoggedIn = false,
}: ArticleCommentsProps) {
  const [showComments, setShowComments] = useState(defaultOpen);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentPath, setCurrentPath] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  
  useEffect(() => {
    const handleToggle = () => setShowComments((prev) => !prev);
    window.addEventListener("toggle-discussion", handleToggle);
    return () => window.removeEventListener("toggle-discussion", handleToggle);
  }, []);

  
  useEffect(() => {
    const total = comments.reduce(
      (acc, c) => acc + 1 + (c.replies?.length ?? 0),
      0
    );
    window.dispatchEvent(
      new CustomEvent("comment-count-changed", { detail: { count: total } })
    );
  }, [comments]);

  
  useEffect(() => {
    if (!showComments || !articleId || comments.length > 0) return;
    setLoadingComments(true);
    fetch(`/api/articles/${articleId}/comments`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments ?? []);
        }
      })
      .catch((err) => console.error("Error loading comments:", err))
      .finally(() => setLoadingComments(false));
  }, [showComments, articleId, comments.length]);

  
  const handleLikeComment = async (commentId: string, parentId?: string) => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return;
    }

    
    setComments((prev) =>
      prev.map((c) => {
        if (parentId && c._id === parentId) {
          return {
            ...c,
            replies: c.replies?.map((r) =>
              r._id === commentId
                ? {
                    ...r,
                    likes: r.likedByUser ? r.likes - 1 : r.likes + 1,
                    likedByUser: !r.likedByUser,
                  }
                : r
            ),
          };
        }
        if (!parentId && c._id === commentId) {
          return {
            ...c,
            likes: c.likedByUser ? c.likes - 1 : c.likes + 1,
            likedByUser: !c.likedByUser,
          };
        }
        return c;
      })
    );

    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to toggle like");
      }
      
      setComments((prev) =>
        prev.map((c) => {
          if (parentId && c._id === parentId) {
            return {
              ...c,
              replies: c.replies?.map((r) =>
                r._id === commentId
                  ? { ...r, likes: data.likes, likedByUser: data.likedByUser }
                  : r
              ),
            };
          }
          if (!parentId && c._id === commentId) {
            return {
              ...c,
              likes: data.likes,
              likedByUser: data.likedByUser,
            };
          }
          return c;
        })
      );
    } catch (err) {
      console.error("Failed to like comment:", err);
      
      setComments((prev) =>
        prev.map((c) => {
          if (parentId && c._id === parentId) {
            return {
              ...c,
              replies: c.replies?.map((r) =>
                r._id === commentId
                  ? {
                      ...r,
                      likes: r.likedByUser ? r.likes + 1 : r.likes - 1,
                      likedByUser: !r.likedByUser,
                    }
                  : r
              ),
            };
          }
          if (!parentId && c._id === commentId) {
            return {
              ...c,
              likes: c.likedByUser ? c.likes + 1 : c.likes - 1,
              likedByUser: !c.likedByUser,
            };
          }
          return c;
        })
      );
    }
  };

  
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !isLoggedIn || !articleId) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentText.trim(),
          parentId: replyingTo,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to post comment");
      }

      const postedComment = data.comment;

      if (replyingTo) {
        setComments((prev) =>
          prev.map((c) => {
            if (c._id === replyingTo) {
              return {
                ...c,
                replies: [...(c.replies ?? []), postedComment],
              };
            }
            return c;
          })
        );
      } else {
        setComments((prev) => [postedComment, ...prev]);
      }

      setNewCommentText("");
      setReplyingTo(null);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to post comment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="article-discussion" className={hideHeader ? "" : "mt-12 border-t border-[var(--border-color)] pt-8"}>

      {}
      {!hideHeader && (
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[var(--border-color)] transition-all hover:shadow-md"
          style={{ background: "var(--bg-surface)" }}
        >
          {}
          <div className="flex items-center gap-4">
            <Link
              href={`/author/${author.slug}`}
              className="relative flex-shrink-0"
              aria-label={`View ${author.name}'s profile`}
            >
              <Avatar name={author.name} avatar={author.avatar} size={14} />
              {author.isVerified && (
                <span className="absolute -bottom-1 -right-1 bg-[var(--bg-base)] rounded-full p-0.5 border border-[var(--border-color)] shadow-sm">
                  <VerifiedBadge size="sm" showLabel={false} />
                </span>
              )}
            </Link>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <Link
                  href={`/author/${author.slug}`}
                  className="text-base font-bold text-[var(--text-primary)] hover:text-[var(--link-color)] transition-colors"
                >
                  {author.name}
                </Link>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase bg-[var(--link-color)]/10 text-[var(--link-color)]">
                  Author
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-1 font-medium">
                <span>{readingTime} min read</span>
                <span className="opacity-40">•</span>
                <span>{views.toLocaleString()} views</span>
              </div>
              {author.bio && (
                <p className="text-xs text-[var(--text-tertiary)] mt-1.5 line-clamp-1 max-w-[280px] md:max-w-md">
                  {author.bio}
                </p>
              )}
            </div>
          </div>

          {}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-discussion"))}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm active:scale-95 ${
              showComments
                ? "bg-[var(--text-primary)] text-[var(--bg-base)] border-[var(--text-primary)]"
                : "bg-[var(--bg-base)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--link-color)] hover:text-[var(--link-color)] hover:shadow"
            }`}
            aria-expanded={showComments}
          >
            <MessageSquare size={14} className={showComments ? "animate-pulse" : ""} />
            <span>Discussion ({comments.reduce((a, c) => a + 1 + (c.replies?.length ?? 0), 0)})</span>
          </button>
        </div>
      )}

      {}
      {showComments && (
        <div
          className={`${
            hideHeader ? "" : "mt-6"
          } rounded-2xl border border-[var(--border-color)] p-5 md:p-6 animate-fade-in space-y-6`}
          style={{ background: "var(--bg-base)" }}
        >

          {}
          {isLoggedIn ? (
            <form onSubmit={handlePostComment} className="space-y-3">
              {replyingTo && (
                <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span>Replying to a comment</span>
                  <button
                    type="button"
                    onClick={() => { setReplyingTo(null); setNewCommentText(""); }}
                    className="text-red-500 hover:underline font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <textarea
                rows={3}
                required
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ask a question or share your thoughts…"
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--link-color)] focus:outline-none transition-colors resize-none"
              />
              {submitError && (
                <div className="flex items-center gap-2 text-xs text-red-500">
                  <AlertCircle size={12} />
                  {submitError}
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !newCommentText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--link-color)] hover:bg-[var(--link-hover)] transition-all cursor-pointer shadow active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <><Loader2 size={12} className="animate-spin" /><span>Posting…</span></>
                  ) : (
                    <><Send size={12} /><span>Post Comment</span></>
                  )}
                </button>
              </div>
            </form>
          ) : (
            
            <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-color)]" style={{ background: "var(--bg-muted)" }}>
              <LogIn size={15} className="text-[var(--link-color)] shrink-0" />
              <p className="text-xs text-[var(--text-secondary)] flex-1">
                <Link
                  href={`/login?redirect=${encodeURIComponent(currentPath)}`}
                  className="font-semibold text-[var(--link-color)] hover:underline"
                >
                  Sign in
                </Link>{" "}
                to join the discussion.
              </p>
            </div>
          )}

          {}
          <div className="border-t border-[var(--border-color)]" />

          {}
          {loadingComments ? (
            <div className="flex items-center justify-center py-10 gap-2 text-[var(--text-tertiary)]">
              <Loader2 size={18} className="animate-spin" />
              <span className="text-sm">Loading discussion…</span>
            </div>
          ) : comments.length === 0 ? (
            
            <div className="flex flex-col items-center py-10 gap-3 text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "var(--bg-muted)" }}
              >
                <MessageCircleOff size={24} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">No discussion yet</p>
              <p className="text-xs text-[var(--text-tertiary)] max-w-xs">
                {isLoggedIn
                  ? "Be the first to ask a question or share your thoughts on this article."
                  : "Sign in to start the discussion."}
              </p>
              {!isLoggedIn && (
                <Link
                  href={`/login?redirect=${encodeURIComponent(currentPath)}`}
                  className="mt-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[var(--link-color)] hover:bg-[var(--link-hover)] transition-colors"
                >
                  <LogIn size={12} />
                  Sign in to comment
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="space-y-4 border-b border-[var(--border-color)] last:border-b-0 pb-5 last:pb-0"
                >
                  {}
                  <CommentRow
                    comment={comment}
                    isLoggedIn={isLoggedIn}
                    onLike={() => handleLikeComment(comment._id)}
                    onReply={() => {
                      setReplyingTo(comment._id);
                      setNewCommentText(`@${comment.authorName} `);
                      document.querySelector<HTMLTextAreaElement>("textarea")?.focus();
                    }}
                  />

                  {}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="pl-6 border-l-2 border-[var(--border-color)] space-y-4 ml-4">
                      {comment.replies.map((reply) => (
                        <ReplyRow
                          key={reply._id}
                          reply={reply}
                          isLoggedIn={isLoggedIn}
                          onLike={() => handleLikeComment(reply._id, comment._id)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


function CommentRow({
  comment,
  isLoggedIn,
  onLike,
  onReply,
}: {
  comment: Comment;
  isLoggedIn: boolean;
  onLike: () => void;
  onReply: () => void;
}) {
  return (
    <div className="flex gap-3">
      <Avatar name={comment.authorName} avatar={comment.authorAvatar} size={8} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[var(--text-primary)]">{comment.authorName}</span>
          {comment.isArticleAuthor && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500">
              Author
            </span>
          )}
          {comment.role && !comment.isArticleAuthor && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-blue-500/10 text-[var(--link-color)]">
              {comment.role}
            </span>
          )}
          <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Clock size={9} />
            {timeAgo(comment.createdAt)}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{comment.content}</p>
        <div className="flex items-center gap-3.5 mt-2.5">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
              comment.likedByUser ? "text-red-500" : "text-[var(--text-tertiary)] hover:text-red-500"
            }`}
            title={isLoggedIn ? "Like" : "Sign in to like"}
          >
            <Heart size={10} fill={comment.likedByUser ? "currentColor" : "none"} />
            <span>{comment.likes} {comment.likes === 1 ? "Like" : "Likes"}</span>
          </button>
          {isLoggedIn && (
            <button
              onClick={onReply}
              className="flex items-center gap-1 text-[10px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--link-color)] transition-colors cursor-pointer"
            >
              <MessageSquare size={10} />
              <span>Reply</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


function ReplyRow({
  reply,
  isLoggedIn,
  onLike,
}: {
  reply: Reply;
  isLoggedIn: boolean;
  onLike: () => void;
}) {
  return (
    <div className="flex gap-3">
      <Avatar name={reply.authorName} avatar={reply.authorAvatar} size={7} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-[var(--text-primary)]">{reply.authorName}</span>
          {reply.isArticleAuthor && (
            <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-red-500/10 text-red-500">
              Author
            </span>
          )}
          <span className="text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Clock size={9} />
            {timeAgo(reply.createdAt)}
          </span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">{reply.content}</p>
        <div className="flex items-center gap-3.5 mt-2.5">
          <button
            onClick={onLike}
            className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${
              reply.likedByUser ? "text-red-500" : "text-[var(--text-tertiary)] hover:text-red-500"
            }`}
            title={isLoggedIn ? "Like" : "Sign in to like"}
          >
            <Heart size={10} fill={reply.likedByUser ? "currentColor" : "none"} />
            <span>{reply.likes} {reply.likes === 1 ? "Like" : "Likes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
