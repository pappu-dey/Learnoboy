"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { MessageSquare, ExternalLink, Calendar, Mail, FileText, CheckCircle, Eye, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface SuggestionArticle {
  _id: string;
  title: string;
  slug: string;
  primaryCategory: string;
  subcategory: string;
}

interface Suggestion {
  _id: string;
  type: string;
  message: string;
  email?: string;
  status: "pending" | "reviewed" | "resolved";
  article?: SuggestionArticle | null;
  createdAt: string;
}

interface WriterSuggestionsClientProps {
  initialSuggestions: Suggestion[];
}

export default function WriterSuggestionsClient({ initialSuggestions }: WriterSuggestionsClientProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "reviewed" | "resolved">("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: "pending" | "reviewed" | "resolved") => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update status.");
      }

      setSuggestions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: newStatus } : s))
      );
    } catch (err: any) {
      alert(err.message || "An error occurred while updating status.");
    } finally {
      setUpdatingId(null);
    }
  };

  
  const filteredSuggestions = suggestions.filter((s) => {
    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    
    
    const articleTitle = s.article?.title || "";
    const matchesSearch =
      s.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: "pending" | "reviewed" | "resolved") => {
    switch (status) {
      case "resolved":
        return <Badge color="green" variant="subtle">Resolved</Badge>;
      case "reviewed":
        return <Badge color="blue" variant="subtle">Reviewed</Badge>;
      default:
        return <Badge color="amber" variant="subtle">Pending</Badge>;
    }
  };

  const getCleanMessage = (message: string) => {
    
    return message.replace(/^\[Article:[^\]]+\]\s*/, "").trim();
  };

  return (
    <div className="space-y-6">
      {}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
          <MessageSquare className="text-[var(--link-color)]" size={24} />
          Reader Suggestions
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Suggestions and feedback submitted by readers to help improve your articles.
        </p>
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between p-4 rounded-2xl border border-[var(--border-color)]" style={{ background: "var(--bg-surface)" }}>
        {}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search suggestions or articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2 text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--link-color)] focus:outline-none transition-colors"
          />
        </div>

        {}
        <div className="flex rounded-xl p-1 bg-[var(--bg-base)] border border-[var(--border-color)] shrink-0">
          {(["all", "pending", "reviewed", "resolved"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer"
              style={
                statusFilter === status
                  ? {
                      background: "var(--bg-surface)",
                      color: "var(--link-color)",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }
                  : { color: "var(--text-secondary)" }
              }
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-16 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-surface)]">
            <AlertCircle size={40} className="mx-auto mb-3 text-[var(--text-tertiary)] opacity-60" />
            <p className="text-sm font-semibold text-[var(--text-primary)]">No suggestions found</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 max-w-xs mx-auto">
              {searchQuery || statusFilter !== "all"
                ? "Try refining your search terms or changing the status filter."
                : "Great job! None of your articles have pending content suggestions from readers."}
            </p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const cleanMsg = getCleanMessage(suggestion.message);
            const isPending = suggestion.status === "pending";
            const isReviewed = suggestion.status === "reviewed";
            const isResolved = suggestion.status === "resolved";

            return (
              <div
                key={suggestion._id}
                className="border border-[var(--border-color)] rounded-2xl p-5 space-y-4 transition-all duration-300 hover:shadow-md"
                style={{ background: "var(--bg-surface)" }}
              >
                {}
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="space-y-1">
                    {suggestion.article ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-[var(--link-color)] uppercase tracking-wider">
                          {suggestion.article.subcategory}
                        </span>
                        <span className="text-[var(--text-tertiary)] text-xs">•</span>
                        <Link
                          href={`/${suggestion.article.primaryCategory}/${suggestion.article.subcategory}/${suggestion.article.slug}`}
                          target="_blank"
                          className="text-sm font-bold text-[var(--text-primary)] hover:text-[var(--link-color)] transition-colors flex items-center gap-1"
                        >
                          {suggestion.article.title}
                          <ExternalLink size={12} className="shrink-0 opacity-60" />
                        </Link>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                        Unlinked Article
                      </span>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-tertiary)]">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {format(new Date(suggestion.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      {suggestion.email && (
                        <span className="flex items-center gap-1">
                          <Mail size={12} />
                          <span className="font-medium">{suggestion.email}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {getStatusBadge(suggestion.status)}
                  </div>
                </div>

                {}
                <div className="text-sm text-[var(--text-primary)] leading-relaxed bg-[var(--bg-base)] border border-[var(--border-color)] p-4 rounded-xl font-mono whitespace-pre-wrap select-all">
                  {cleanMsg}
                </div>

                {}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {suggestion.article ? (
                    <Link
                      href={`/admin/articles/${suggestion.article._id}/edit`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[var(--link-color)] hover:underline"
                    >
                      Edit Article in Editor <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <span className="text-xs text-[var(--text-tertiary)] font-medium">Suggestion on deleted article</span>
                  )}

                  {}
                  <div className="flex items-center gap-2">
                    {updatingId === suggestion._id ? (
                      <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] font-medium px-3 py-1.5">
                        <Loader2 size={12} className="animate-spin text-[var(--link-color)]" />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      <>
                        {!isPending && (
                          <button
                            onClick={() => handleUpdateStatus(suggestion._id, "pending")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-amber-500 hover:border-amber-500/20 hover:bg-amber-500/5 transition-all cursor-pointer"
                          >
                            Mark Pending
                          </button>
                        )}
                        {!isReviewed && (
                          <button
                            onClick={() => handleUpdateStatus(suggestion._id, "reviewed")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-blue-500 hover:border-blue-500/20 hover:bg-blue-500/5 transition-all cursor-pointer"
                          >
                            Mark Reviewed
                          </button>
                        )}
                        {!isResolved && (
                          <button
                            onClick={() => handleUpdateStatus(suggestion._id, "resolved")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-green-600 hover:border-green-500/20 hover:bg-green-500/5 transition-all cursor-pointer"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
