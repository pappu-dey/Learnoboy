"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ClipboardList, CheckCircle, XCircle, RefreshCw, Search, Eye,
  ChevronDown, ChevronUp, AlertTriangle, Clock, GraduationCap,
  Building2, Briefcase, BookOpen, Mail, User,
} from "lucide-react";

type WriterStatus = "none" | "pending" | "needs-review" | "approved" | "rejected";

interface WriterApplication {
  fullName: string;
  email: string;
  qualification: string;
  expertise: string[];
  whyWrite: string;
  college?: string;
  company?: string;
  experience?: number;
  appliedAt: string;
}

interface ApplicantRow {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  writerStatus: WriterStatus;
  writerApplication?: WriterApplication;
  writerApplicationMessage?: string;
  createdAt: string;
}

const STATUS_STYLES: Record<WriterStatus, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Pending", bg: "rgba(245,158,11,0.12)", color: "#d97706", icon: <Clock size={11} /> },
  "needs-review": { label: "Needs Review", bg: "rgba(99,102,241,0.12)", color: "#6366f1", icon: <AlertTriangle size={11} /> },
  approved: { label: "Approved", bg: "rgba(16,185,129,0.12)", color: "#059669", icon: <CheckCircle size={11} /> },
  rejected: { label: "Rejected", bg: "rgba(239,68,68,0.12)", color: "#dc2626", icon: <XCircle size={11} /> },
  none: { label: "—", bg: "transparent", color: "var(--text-tertiary)", icon: null },
};

const FILTER_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "needs-review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function AdminApplicationsClient() {
  const [applicants, setApplicants] = useState<ApplicantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [modal, setModal] = useState<ApplicantRow | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchApplicants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) setApplicants(data.data);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

  const patch = async (id: string, body: Record<string, unknown>, successMsg: string) => {
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
        await fetchApplicants();
        setModal(null);
      } else {
        showToast(data.error || "Action failed.", false);
      }
    } catch {
      showToast("Network error.", false);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = applicants.filter((u) => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) ||
      u.writerApplication?.expertise?.some((e) => e.toLowerCase().includes(q));
  });

  const pendingCount = applicants.filter((a) => a.writerStatus === "pending").length;

  return (
    <div className="space-y-6">
      {}
      {toast && (
        <div
          className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg"
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

      {}
      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          onClick={() => setModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
            style={{ background: "var(--bg-surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="font-bold text-[var(--text-primary)]">Application Details</h2>
              <button onClick={() => setModal(null)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors">✕</button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <ModalRow label="Name" value={modal.writerApplication?.fullName || modal.name} />
              <ModalRow label="Email" value={modal.writerApplication?.email || modal.email} />
              {modal.writerApplication?.qualification && <ModalRow label="Qualification" value={modal.writerApplication.qualification} icon={<GraduationCap size={13} />} />}
              {modal.writerApplication?.college && <ModalRow label="College" value={modal.writerApplication.college} icon={<BookOpen size={13} />} />}
              {modal.writerApplication?.company && <ModalRow label="Company" value={modal.writerApplication.company} icon={<Building2 size={13} />} />}
              {modal.writerApplication?.experience !== undefined && modal.writerApplication.experience > 0 && (
                <ModalRow label="Experience" value={`${modal.writerApplication.experience} year(s)`} icon={<Briefcase size={13} />} />
              )}
              {modal.writerApplication?.expertise && modal.writerApplication.expertise.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">Expertise</p>
                  <div className="flex flex-wrap gap-1.5">
                    {modal.writerApplication.expertise.map((e) => (
                      <span key={e} className="px-2.5 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(37,99,235,0.1)", color: "var(--link-color)" }}>{e}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">Why they want to write</p>
                <p className="text-sm text-[var(--text-secondary)] italic leading-relaxed p-3 rounded-xl" style={{ background: "var(--bg-muted)" }}>
                  &ldquo;{modal.writerApplication?.whyWrite || modal.writerApplicationMessage || "No description provided."}&rdquo;
                </p>
              </div>
              <ModalRow label="Applied" value={new Date(modal.writerApplication?.appliedAt || modal.createdAt).toLocaleDateString("en-US", { dateStyle: "long" })} />
            </div>
            {}
            <div className="p-4 flex items-center justify-end gap-2 border-t border-[var(--border-color)]" style={{ background: "var(--bg-muted)" }}>
              {modal.writerStatus !== "approved" && (
                <button
                  onClick={() => patch(modal._id, { writerStatus: "approved" }, `${modal.name} approved as writer!`)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                >
                  <CheckCircle size={13} /> Approve
                </button>
              )}
              {modal.writerStatus !== "needs-review" && (
                <button
                  onClick={() => patch(modal._id, { writerStatus: "needs-review" }, `Flagged for review.`)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-[var(--bg-surface)] disabled:opacity-50"
                  style={{ color: "#6366f1", borderColor: "rgba(99,102,241,0.35)" }}
                >
                  <AlertTriangle size={13} /> Needs Review
                </button>
              )}
              {modal.writerStatus !== "rejected" && (
                <button
                  onClick={() => patch(modal._id, { writerStatus: "rejected" }, `${modal.name}'s application rejected.`)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                  style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" }}
                >
                  <XCircle size={13} /> Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight flex items-center gap-2">
            <ClipboardList size={22} /> Writer Applications
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: "rgba(245,158,11,0.15)", color: "#d97706" }}>
                {pendingCount} pending
              </span>
            )}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Review, approve, or reject writer applications.</p>
        </div>
        <button
          onClick={fetchApplicants}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search by name, email, or expertise…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2 text-sm rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className="px-3 py-2 rounded-xl text-xs font-medium border transition-all"
              style={statusFilter === opt.value
                ? { background: "var(--link-color)", color: "#fff", borderColor: "var(--link-color)" }
                : { background: "var(--bg-surface)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: "var(--bg-surface)" }}>
        {loading ? (
          <div className="py-16 text-center text-[var(--text-tertiary)] text-sm">Loading applications…</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <ClipboardList size={30} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-40" />
            <p className="text-sm text-[var(--text-tertiary)]">No applications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {filtered.map((u) => {
              const st = STATUS_STYLES[u.writerStatus];
              const isExpanded = expanded === u._id;
              return (
                <div key={u._id} className="hover:bg-[var(--bg-muted)] transition-colors">
                  {}
                  <div className="flex items-center gap-4 px-5 py-4">
                    {}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 overflow-hidden"
                      style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}
                    >
                      {u.avatar ? <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" /> : u.name.slice(0, 2).toUpperCase()}
                    </div>

                    {}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{u.name}</p>
                        <span
                          className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{u.email}</p>
                      {u.writerApplication?.expertise && u.writerApplication.expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {u.writerApplication.expertise.slice(0, 3).map((e) => (
                            <span key={e} className="px-1.5 py-0.5 rounded text-[9px] font-semibold" style={{ background: "rgba(37,99,235,0.08)", color: "var(--link-color)" }}>{e}</span>
                          ))}
                          {u.writerApplication.expertise.length > 3 && (
                            <span className="text-[9px] text-[var(--text-tertiary)]">+{u.writerApplication.expertise.length - 3}</span>
                          )}
                        </div>
                      ) : (
                        <p className="text-[10px] text-[var(--text-tertiary)] mt-1 italic">Legacy application</p>
                      )}
                    </div>
 
                    {}
                    <span className="text-xs text-[var(--text-tertiary)] hidden md:block shrink-0">
                      {new Date(u.writerApplication?.appliedAt || u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>

                    {}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setModal(u)}
                        title="View full application"
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:border-[var(--link-color)] transition-all"
                      >
                        <Eye size={13} />
                      </button>
                      {u.writerStatus === "pending" || u.writerStatus === "needs-review" ? (
                        <>
                          <button
                            onClick={() => patch(u._id, { writerStatus: "approved" }, `${u.name} approved!`)}
                            disabled={!!actionLoading}
                            title="Approve"
                            className="p-1.5 rounded-lg border border-[var(--border-color)] text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all disabled:opacity-40"
                          >
                            <CheckCircle size={13} />
                          </button>
                          <button
                            onClick={() => patch(u._id, { writerStatus: "rejected" }, `${u.name} rejected.`)}
                            disabled={!!actionLoading}
                            title="Reject"
                            className="p-1.5 rounded-lg border border-[var(--border-color)] text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-40"
                          >
                            <XCircle size={13} />
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : u._id)}
                        className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-tertiary)] hover:bg-[var(--bg-muted)] transition-all"
                      >
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>
                  </div>

                  {}
                  {isExpanded && (
                    <div className="px-5 py-5 border-t border-[var(--border-color)]" style={{ background: "var(--bg-muted)" }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {}
                        <div className="space-y-3.5">
                          <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                            <ClipboardList size={13} className="text-[var(--link-color)]" /> Application Information
                          </h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div className="space-y-1">
                              <p className="text-[var(--text-tertiary)] font-medium">Applied Name</p>
                              <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                <User size={12} className="text-[var(--text-tertiary)]" />
                                {u.writerApplication?.fullName || u.name}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[var(--text-tertiary)] font-medium">Applied Email</p>
                              <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1 truncate">
                                <Mail size={12} className="text-[var(--text-tertiary)]" />
                                {u.writerApplication?.email || u.email}
                              </p>
                            </div>
                            
                            {u.writerApplication?.qualification && (
                              <div className="space-y-1">
                                <p className="text-[var(--text-tertiary)] font-medium">Highest Qualification</p>
                                <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                  <GraduationCap size={12} className="text-[var(--text-tertiary)]" />
                                  {u.writerApplication.qualification}
                                </p>
                              </div>
                            )}

                            {u.writerApplication?.college && (
                              <div className="space-y-1">
                                <p className="text-[var(--text-tertiary)] font-medium">College / University</p>
                                <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                  <BookOpen size={12} className="text-[var(--text-tertiary)]" />
                                  {u.writerApplication.college}
                                </p>
                              </div>
                            )}

                            {u.writerApplication?.company && (
                              <div className="space-y-1">
                                <p className="text-[var(--text-tertiary)] font-medium">Current Company</p>
                                <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                  <Building2 size={12} className="text-[var(--text-tertiary)]" />
                                  {u.writerApplication.company}
                                </p>
                              </div>
                            )}

                            {u.writerApplication?.experience !== undefined && u.writerApplication.experience > 0 && (
                              <div className="space-y-1">
                                <p className="text-[var(--text-tertiary)] font-medium">Experience</p>
                                <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                  <Briefcase size={12} className="text-[var(--text-tertiary)]" />
                                  {u.writerApplication.experience} Year(s)
                                </p>
                              </div>
                            )}

                            <div className="space-y-1">
                              <p className="text-[var(--text-tertiary)] font-medium">Submission Date</p>
                              <p className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                                <Clock size={12} className="text-[var(--text-tertiary)]" />
                                {new Date(u.writerApplication?.appliedAt || u.createdAt).toLocaleDateString("en-US", {
                                  dateStyle: "medium",
                                })}
                              </p>
                            </div>
                          </div>

                          {}
                          {u.writerApplication?.expertise && u.writerApplication.expertise.length > 0 && (
                            <div className="pt-2">
                              <p className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                                Areas of Expertise
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {u.writerApplication.expertise.map((e) => (
                                  <span
                                    key={e}
                                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                                    style={{ background: "rgba(37,99,235,0.08)", color: "var(--link-color)", border: "1px solid rgba(37,99,235,0.15)" }}
                                  >
                                    {e}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {}
                        <div className="flex flex-col h-full justify-between space-y-3.5">
                          <div>
                            <h4 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider mb-2">
                              Why they want to write
                            </h4>
                            <div 
                              className="text-sm text-[var(--text-secondary)] italic leading-relaxed p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-inner relative overflow-hidden"
                            >
                              <span className="absolute -right-2 -bottom-4 text-7xl font-serif text-[var(--text-tertiary)] opacity-10 select-none pointer-events-none">&ldquo;</span>
                              &ldquo;{u.writerApplication?.whyWrite || u.writerApplicationMessage || "No description provided."}&rdquo;
                            </div>
                          </div>

                          {}
                          {(u.writerStatus === "pending" || u.writerStatus === "needs-review") && (
                            <div className="flex items-center gap-2 pt-4 border-t border-[var(--border-color)] mt-auto">
                              <button
                                onClick={() => patch(u._id, { writerStatus: "approved" }, `${u.name} approved as writer!`)}
                                disabled={!!actionLoading}
                                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
                              >
                                <CheckCircle size={13} /> Approve
                              </button>
                              <button
                                onClick={() => patch(u._id, { writerStatus: "needs-review" }, `Flagged for review.`)}
                                disabled={!!actionLoading}
                                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-[var(--bg-surface)] disabled:opacity-50"
                                style={{ color: "#6366f1", borderColor: "rgba(99,102,241,0.35)" }}
                              >
                                <AlertTriangle size={13} /> Review Needed
                              </button>
                              <button
                                onClick={() => patch(u._id, { writerStatus: "rejected" }, `${u.name}'s application rejected.`)}
                                disabled={!!actionLoading}
                                className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-red-50 dark:hover:bg-red-950/20 disabled:opacity-50"
                                style={{ color: "#dc2626", borderColor: "rgba(220,38,38,0.3)" }}
                              >
                                <XCircle size={13} /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {}
        {!loading && (
          <div className="px-5 py-3 border-t border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-tertiary)]">{filtered.length} application{filtered.length !== 1 ? "s" : ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ModalRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="flex items-center gap-1 text-xs font-semibold text-[var(--text-tertiary)] w-28 shrink-0 pt-0.5 uppercase tracking-wide">
        {icon} {label}
      </span>
      <span className="text-sm text-[var(--text-primary)] flex-1">{value}</span>
    </div>
  );
}
