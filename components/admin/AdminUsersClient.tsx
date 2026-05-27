"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  Crown,
  PenLine,
  BookOpen,
  RefreshCw,
  Search,
  ChevronDown,
} from "lucide-react";

type WriterStatus = "none" | "pending" | "approved" | "rejected";
type UserRole = "reader" | "writer" | "superadmin";

interface UserRow {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  writerStatus: WriterStatus;
  writerApplicationMessage?: string;
  createdAt: string;
  avatar?: string;
}

const ROLE_STYLES: Record<UserRole, { label: string; bg: string; color: string }> = {
  superadmin: { label: "Super Admin", bg: "rgba(139,92,246,0.12)", color: "#7c3aed" },
  writer:     { label: "Writer",      bg: "rgba(16,185,129,0.12)",  color: "#059669" },
  reader:     { label: "Reader",      bg: "rgba(37,99,235,0.10)",   color: "#2563eb" },
};

const STATUS_STYLES: Record<WriterStatus, { label: string; bg: string; color: string }> = {
  pending:  { label: "Pending",  bg: "rgba(245,158,11,0.12)", color: "#d97706" },
  approved: { label: "Approved", bg: "rgba(16,185,129,0.12)", color: "#059669" },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.12)",  color: "#dc2626" },
  none:     { label: "—",        bg: "transparent",           color: "var(--text-tertiary)" },
};

export default function AdminUsersClient() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [expandedMsg, setExpandedMsg] = useState<string | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const patch = async (id: string, body: Record<string, string>, successMsg: string) => {
    setActionLoading(id + JSON.stringify(body));
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        showToast(successMsg);
        await fetchUsers();
      } else {
        showToast(data.error || "Action failed.", false);
      }
    } catch {
      showToast("Network error.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setActionLoading(id + "delete");
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showToast(`"${name}" deleted.`);
        await fetchUsers();
      } else {
        showToast(data.error || "Delete failed.", false);
      }
    } catch {
      showToast("Network error.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const pending = users.filter((u) => u.writerStatus === "pending");

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2"
          style={{
            background: toast.ok ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#ef4444,#dc2626)",
            color: "#fff",
            boxShadow: toast.ok ? "0 4px 14px rgba(16,185,129,0.4)" : "0 4px 14px rgba(239,68,68,0.4)",
          }}
        >
          {toast.ok ? <CheckCircle size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <Users size={22} /> Users
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage users, roles, and writer applications.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Pending Writer Applications Banner */}
      {pending.length > 0 && (
        <div
          className="flex flex-col gap-3 p-4 rounded-2xl border"
          style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}
        >
          <p className="text-sm font-semibold text-amber-600 flex items-center gap-2">
            <PenLine size={15} />
            {pending.length} pending writer application{pending.length > 1 ? "s" : ""}
          </p>
          {pending.map((u) => (
            <div key={u._id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border-color)" }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)]">{u.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">{u.email}</p>
                {u.writerApplicationMessage && (
                  <button
                    className="text-xs mt-1 text-amber-600 hover:underline flex items-center gap-1"
                    onClick={() => setExpandedMsg(expandedMsg === u._id ? null : u._id)}
                  >
                    {expandedMsg === u._id ? "Hide message" : "View message"} <ChevronDown size={11} className={expandedMsg === u._id ? "rotate-180 transition-transform" : "transition-transform"} />
                  </button>
                )}
                {expandedMsg === u._id && (
                  <p className="text-xs mt-1.5 p-2 rounded-lg text-[var(--text-secondary)] italic" style={{ background: "var(--bg-muted)" }}>
                    {u.writerApplicationMessage}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => patch(u._id, { writerStatus: "approved" }, `${u.name} approved as writer!`)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                >
                  <CheckCircle size={13} /> Approve
                </button>
                <button
                  onClick={() => patch(u._id, { writerStatus: "rejected" }, `${u.name}'s application rejected.`)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                  style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" }}
                >
                  <XCircle size={13} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "superadmin", "writer", "reader"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-all capitalize"
              style={roleFilter === r
                ? { background: "var(--link-color)", color: "#fff", borderColor: "var(--link-color)" }
                : { background: "var(--bg-surface)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }
              }
            >
              {r === "all" ? "All" : r === "superadmin" ? "Super Admin" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        {loading ? (
          <div className="py-16 text-center text-[var(--text-tertiary)] text-sm">Loading users…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={30} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-40" />
            <p className="text-sm text-[var(--text-tertiary)]">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border-color)", background: "var(--bg-muted)" }}>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">User</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Role</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden sm:table-cell">Writer Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider hidden md:table-cell">Joined</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filtered.map((u) => {
                  const roleStyle = ROLE_STYLES[u.role];
                  const statusStyle = STATUS_STYLES[u.writerStatus];
                  return (
                    <tr key={u._id} className="hover:bg-[var(--bg-muted)] transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden"
                            style={{ background: u.role === "superadmin" ? "linear-gradient(135deg,#7c3aed,#2563eb)" : u.role === "writer" ? "linear-gradient(135deg,#10b981,#059669)" : "linear-gradient(135deg,#2563eb,#1d4ed8)" }}>
                            {u.avatar
                              ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                              : u.name.slice(0, 2).toUpperCase()
                            }
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-[var(--text-primary)] text-sm truncate">{u.name}</p>
                            <p className="text-xs text-[var(--text-tertiary)] truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                          style={{ background: roleStyle.bg, color: roleStyle.color }}>
                          {u.role === "superadmin" && <Crown size={10} />}
                          {u.role === "writer" && <PenLine size={10} />}
                          {u.role === "reader" && <BookOpen size={10} />}
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                          style={{ background: statusStyle.bg, color: statusStyle.color }}>
                          {statusStyle.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-[var(--text-tertiary)] hidden md:table-cell">
                        {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Promote to writer */}
                          {u.role === "reader" && u.writerStatus !== "pending" && (
                            <button
                              onClick={() => patch(u._id, { role: "writer", writerStatus: "approved" }, `${u.name} promoted to writer.`)}
                              disabled={!!actionLoading}
                              title="Promote to Writer"
                              className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all disabled:opacity-40"
                            >
                              <PenLine size={13} />
                            </button>
                          )}
                          {/* Approve pending */}
                          {u.writerStatus === "pending" && (
                            <>
                              <button
                                onClick={() => patch(u._id, { writerStatus: "approved" }, `${u.name} approved!`)}
                                disabled={!!actionLoading}
                                title="Approve Writer"
                                className="p-1.5 rounded-lg border border-[var(--border-color)] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all disabled:opacity-40"
                              >
                                <CheckCircle size={13} />
                              </button>
                              <button
                                onClick={() => patch(u._id, { writerStatus: "rejected" }, `${u.name} rejected.`)}
                                disabled={!!actionLoading}
                                title="Reject Writer"
                                className="p-1.5 rounded-lg border border-[var(--border-color)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-40"
                              >
                                <XCircle size={13} />
                              </button>
                            </>
                          )}
                          {/* Demote writer to reader */}
                          {u.role === "writer" && (
                            <button
                              onClick={() => patch(u._id, { role: "reader", writerStatus: "none" }, `${u.name} demoted to reader.`)}
                              disabled={!!actionLoading}
                              title="Demote to Reader"
                              className="p-1.5 rounded-lg border border-[var(--border-color)] text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all disabled:opacity-40"
                            >
                              <BookOpen size={13} />
                            </button>
                          )}
                          {/* Delete */}
                          {u.role !== "superadmin" && (
                            <button
                              onClick={() => deleteUser(u._id, u.name)}
                              disabled={!!actionLoading}
                              title="Delete user"
                              className="p-1.5 rounded-lg border border-[var(--border-color)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-40"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <div className="px-5 py-3 border-t border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-tertiary)]">
              {filtered.length} of {users.length} users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
