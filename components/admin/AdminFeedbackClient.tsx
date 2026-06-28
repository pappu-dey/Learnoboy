"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Trash2,
  CheckCircle,
  Eye,
  Calendar,
  Inbox,
  Mail,
  Search,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { IFeedback } from "@/types";

interface Props {
  initialFeedbacks: IFeedback[];
}

export function AdminFeedbackClient({ initialFeedbacks }: Props) {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<IFeedback[]>(initialFeedbacks);
  
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  
  const refreshFeedbacks = useCallback(async () => {
    try {
      const res = await fetch("/api/feedback");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setFeedbacks(json.data);
      }
    } catch (err) {
      console.error("Error refreshing feedbacks:", err);
      router.refresh();
    }
  }, [router]);

  
  async function handleUpdateStatus(id: string, newStatus: "reviewed" | "resolved") {
    setUpdatingId(id);
    
    setFeedbacks((prev) =>
      prev.map((fb) => (fb._id === id ? { ...fb, status: newStatus } : fb))
    );

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        
        alert("Failed to update status.");
        await refreshFeedbacks();
      }
    } catch {
      alert("Network error.");
      await refreshFeedbacks();
    } finally {
      setUpdatingId(null);
    }
  }

  
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this feedback? This cannot be undone.")) return;
    
    setDeletingId(id);
    
    const cachedFeedbacks = [...feedbacks];
    setFeedbacks((prev) => prev.filter((fb) => fb._id !== id));

    try {
      const res = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        alert("Failed to delete feedback.");
        setFeedbacks(cachedFeedbacks);
      }
    } catch {
      alert("Network error.");
      setFeedbacks(cachedFeedbacks);
    } finally {
      setDeletingId(null);
    }
  }

  
  const stats = useMemo(() => {
    const total = feedbacks.length;
    const pending = feedbacks.filter((fb) => fb.status === "pending").length;
    const reviewed = feedbacks.filter((fb) => fb.status === "reviewed").length;
    const resolved = feedbacks.filter((fb) => fb.status === "resolved").length;
    return { total, pending, reviewed, resolved };
  }, [feedbacks]);

  
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const matchesSearch =
        fb.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (fb.email && fb.email.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesStatus = statusFilter === "all" ? true : fb.status === statusFilter;
      const matchesType = typeFilter === "all" ? true : fb.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [feedbacks, searchQuery, statusFilter, typeFilter]);

  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bug Report":
        return { bg: "rgba(239, 68, 68, 0.08)", text: "#ef4444", border: "rgba(239, 68, 68, 0.15)" };
      case "Feature Request":
        return { bg: "rgba(139, 92, 246, 0.08)", text: "#8b5cf6", border: "rgba(139, 92, 246, 0.15)" };
      case "Content Suggestion":
        return { bg: "rgba(16, 185, 129, 0.08)", text: "#10b981", border: "rgba(16, 185, 129, 0.15)" };
      default:
        return { bg: "rgba(59, 130, 246, 0.08)", text: "#3b82f6", border: "rgba(59, 130, 246, 0.15)" };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return { bg: "rgba(16, 185, 129, 0.12)", text: "#10b981", label: "Resolved" };
      case "reviewed":
        return { bg: "rgba(245, 158, 11, 0.12)", text: "#f59e0b", label: "Reviewed" };
      default:
        return { bg: "rgba(59, 130, 246, 0.12)", text: "#3b82f6", label: "Pending" };
    }
  };

  return (
    <div>
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={22} style={{ color: "var(--link-color)" }} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              User Feedback
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Review bug reports, feature requests, and community suggestions
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "All Submissions", count: stats.total, color: "var(--link-color)" },
          { label: "Pending", count: stats.pending, color: "#3b82f6" },
          { label: "Reviewed", count: stats.reviewed, color: "#f59e0b" },
          { label: "Resolved", count: stats.resolved, color: "#10b981" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between"
            style={{ background: "var(--bg-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              {item.label}
            </p>
            <p className="text-3xl font-extrabold mt-2" style={{ color: item.color }}>
              {item.count}
            </p>
          </div>
        ))}
      </div>

      {}
      <div
        className="p-4 rounded-2xl border border-[var(--border-color)] mb-6 flex flex-col md:flex-row items-center gap-4"
        style={{ background: "var(--bg-surface)" }}
      >
        {}
        <div className="relative w-full md:flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search feedback message or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)] transition-shadow"
          />
        </div>

        {}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {}
          <div className="flex-1 md:flex-initial">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="Content Suggestion">Content Suggestion</option>
              <option value="General Feedback">General Feedback</option>
            </select>
          </div>

          {}
          <div className="flex-1 md:flex-initial">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-sm border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {}
      {filteredFeedbacks.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--border-color)] text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
            style={{ background: "rgba(37,99,235,0.08)" }}
          >
            <Inbox size={22} style={{ color: "var(--link-color)" }} />
          </div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">
            No feedback found
          </p>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">
            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search query or filters."
              : "Feedback submitted by learners will show up here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFeedbacks.map((fb) => {
            const typeStyle = getTypeColor(fb.type);
            const statusStyle = getStatusBadge(fb.status);
            
            return (
              <div
                key={fb._id}
                className="group relative p-6 rounded-2xl border border-[var(--border-color)] transition-all duration-300 hover:shadow-md flex flex-col md:flex-row md:items-start justify-between gap-6"
                style={{ background: "var(--bg-surface)" }}
              >
                {}
                <div
                  className="absolute left-0 top-4 bottom-4 w-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: typeStyle.text }}
                />

                {}
                <div className="flex-1 space-y-3.5 min-w-0">
                  {}
                  <div className="flex flex-wrap items-center gap-2">
                    {}
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border"
                      style={{
                        backgroundColor: typeStyle.bg,
                        color: typeStyle.text,
                        borderColor: typeStyle.border,
                      }}
                    >
                      {fb.type}
                    </span>

                    {}
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                      style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.text,
                      }}
                    >
                      {statusStyle.label}
                    </span>

                    {}
                    <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 ml-1.5">
                      <Calendar size={12} />
                      {new Date(fb.createdAt).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </div>

                  {}
                  <p className="text-sm leading-relaxed text-[var(--text-primary)] font-medium whitespace-pre-line">
                    {fb.message}
                  </p>

                  {}
                  {fb.email ? (
                    <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)]">
                      <Mail size={13} className="text-[var(--text-tertiary)]" />
                      <a href={`mailto:${fb.email}`} className="hover:underline hover:text-[var(--link-color)] transition-colors">
                        {fb.email}
                      </a>
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--text-tertiary)] italic flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      Submitted anonymously
                    </div>
                  )}
                </div>

                {}
                <div className="flex md:flex-col items-center gap-2 self-end md:self-start flex-shrink-0">
                  {fb.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(fb._id, "reviewed")}
                      disabled={updatingId === fb._id}
                      className="w-full md:w-36 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-base)] hover:bg-[var(--bg-muted)] transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Eye size={13} />
                      Mark Reviewed
                    </button>
                  )}

                  {fb.status !== "resolved" && (
                    <button
                      onClick={() => handleUpdateStatus(fb._id, "resolved")}
                      disabled={updatingId === fb._id}
                      className="w-full md:w-36 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle size={13} />
                      Mark Resolved
                    </button>
                  )}

                  {fb.status === "resolved" && (
                    <div className="w-full md:w-36 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                      <CheckCircle2 size={13} />
                      Completed
                    </div>
                  )}

                  {}
                  <button
                    onClick={() => handleDelete(fb._id)}
                    disabled={deletingId === fb._id}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/25 transition-colors disabled:opacity-30 self-end md:self-center"
                    title="Delete feedback"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
