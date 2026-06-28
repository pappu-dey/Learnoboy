"use client";

import { useState, useMemo } from "react";
import { Heart, Search, CheckCircle, XCircle, Edit3, Trash2, Calendar, Mail, ShieldAlert, Award } from "lucide-react";
import type { IDonor } from "@/types";

interface Props {
  initialDonors: IDonor[];
}

export function AdminDonorsClient({ initialDonors }: Props) {
  const [donors, setDonors] = useState<IDonor[]>(initialDonors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  
  const [editingDonor, setEditingDonor] = useState<IDonor | null>(null);
  const [verifyAmount, setVerifyAmount] = useState<string>("");
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const refreshDonors = async () => {
    try {
      const res = await fetch("/api/donors?admin=true"); 
      
      const refreshRes = await fetch("/api/donors"); 
      
    } catch (err) {
      console.error(err);
    }
  };

  
  const stats = useMemo(() => {
    const total = donors.length;
    const pending = donors.filter((d) => d.status === "pending").length;
    const approved = donors.filter((d) => d.status === "approved").length;
    const rejected = donors.filter((d) => d.status === "rejected").length;
    const totalRaised = donors
      .filter((d) => d.status === "approved")
      .reduce((sum, d) => sum + (d.amount || 0), 0);
    return { total, pending, approved, rejected, totalRaised };
  }, [donors]);

  
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ? true : d.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [donors, searchQuery, statusFilter]);

  
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonor) return;

    const numericAmount = Number(verifyAmount);
    if (isNaN(numericAmount) || numericAmount < 1) {
      alert("Please enter a valid amount of at least Rp 1.");
      return;
    }

    setSubmittingId(editingDonor._id);

    try {
      const res = await fetch(`/api/donors/${editingDonor._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          status: "approved",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to verify donor.");
      } else {
        
        setDonors((prev) =>
          prev.map((d) =>
            d._id === editingDonor._id
              ? { ...d, amount: numericAmount, status: "approved" as const }
              : d
          )
        );
        setEditingDonor(null);
      }
    } catch {
      alert("Network error.");
    } finally {
      setSubmittingId(null);
    }
  };

  
  const handleInstantApprove = async (d: IDonor) => {
    try {
      const res = await fetch(`/api/donors/${d._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: d.amount,
          status: "approved",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to approve donor.");
      } else {
        setDonors((prev) =>
          prev.map((item) =>
            item._id === d._id ? { ...item, status: "approved" as const } : item
          )
        );
      }
    } catch {
      alert("Network error.");
    }
  };

  
  const handleInstantReject = async (d: IDonor) => {
    try {
      const res = await fetch(`/api/donors/${d._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: d.amount,
          status: "rejected",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        alert(json.error ?? "Failed to reject donor.");
      } else {
        setDonors((prev) =>
          prev.map((item) =>
            item._id === d._id ? { ...item, status: "rejected" as const } : item
          )
        );
      }
    } catch {
      alert("Network error.");
    }
  };

  
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donor record? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/donors/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Failed to delete donor.");
      } else {
        setDonors((prev) => prev.filter((d) => d._id !== id));
      }
    } catch {
      alert("Network error.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart size={22} className="text-red-500 fill-red-500" />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Donor Approvals
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Verify scan submissions, enter donation amounts, and manage the supporters board
          </p>
        </div>
      </div>

      {}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Submissions", count: stats.total, color: "var(--link-color)" },
          { label: "Pending Verification", count: stats.pending, color: "#f59e0b" },
          { label: "Approved Supporters", count: stats.approved, color: "#10b981" },
          { label: "Rejected Submissions", count: stats.rejected, color: "#ef4444" },
          { label: "Total Funds Raised", count: `Rp ${stats.totalRaised.toLocaleString("id-ID")}`, color: "#10b981" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-[var(--border-color)] flex flex-col justify-between"
            style={{ background: "var(--bg-surface)" }}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
              {item.label}
            </p>
            <p className="text-2xl font-black mt-2" style={{ color: item.color }}>
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
        <div className="relative w-full md:flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <input
            type="text"
            placeholder="Search donors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)] transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2">
          {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize border transition-all"
              style={
                statusFilter === tab
                  ? {
                      background: "var(--link-color)",
                      color: "#fff",
                      borderColor: "var(--link-color)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-color)",
                    }
              }
            >
              {tab === "all" ? "Show All" : tab === "pending" ? "Pending" : tab === "approved" ? "Approved" : "Rejected"}
            </button>
          ))}
        </div>
      </div>

      {}
      {filteredDonors.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-[var(--border-color)] text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4">
            <Heart size={22} className="text-orange-500" />
          </div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">
            No donors found
          </p>
          <p className="text-sm text-[var(--text-secondary)] max-w-xs">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search query or filters."
              : "No QR Code donation submissions registered yet."}
          </p>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-sm" style={{ background: "var(--bg-surface)" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-secondary)] font-semibold text-xs uppercase">
                  <th className="p-4">Donor</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Registered Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)] text-sm text-[var(--text-primary)]">
                {filteredDonors.map((d) => (
                  <tr key={d._id} className="hover:bg-[var(--bg-muted)]/40 transition-colors">
                    <td className="p-4 font-bold">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--link-color)]/10 text-[var(--link-color)] font-extrabold text-xs flex items-center justify-center uppercase">
                          {d.name.charAt(0)}
                        </div>
                        {d.name}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Mail size={13} />
                        <a href={`mailto:${d.email}`} className="hover:underline hover:text-[var(--link-color)]">
                          {d.email}
                        </a>
                      </div>
                    </td>
                    <td className="p-4 font-extrabold text-amber-500">
                      {d.amount > 0 ? `Rp ${d.amount.toLocaleString("id-ID")}` : "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                        style={
                          d.status === "approved"
                            ? { backgroundColor: "rgba(16, 185, 129, 0.12)", color: "#10b981" }
                            : d.status === "rejected"
                            ? { backgroundColor: "rgba(239, 68, 68, 0.12)", color: "#ef4444" }
                            : { backgroundColor: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" }
                        }
                      >
                        {d.status === "approved" ? "Approved" : d.status === "rejected" ? "Rejected" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-[var(--text-tertiary)]">
                      <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(d.createdAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {}
                        {d.status !== "approved" && (
                          <button
                            onClick={() => handleInstantApprove(d)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                            title="Instant verify and approve"
                          >
                            <CheckCircle size={15} />
                          </button>
                        )}

                        {}
                        {d.status !== "rejected" && (
                          <button
                            onClick={() => handleInstantReject(d)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-200 dark:hover:border-rose-800"
                            title="Reject donor"
                          >
                            <XCircle size={15} />
                          </button>
                        )}

                        {}
                        <button
                          onClick={() => {
                            setEditingDonor(d);
                            setVerifyAmount(d.amount > 0 ? d.amount.toString() : "10000");
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-800"
                          title="Edit amount & approve"
                        >
                          <Edit3 size={15} />
                        </button>

                        {}
                        <button
                          onClick={() => handleDelete(d._id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                          title="Delete donor submission"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {}
      {editingDonor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && setEditingDonor(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6 shadow-2xl relative"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              animation: "slideUp 0.2s ease-out",
            }}
          >
            <h3 className="text-base font-bold mb-1 text-[var(--text-primary)]">
              {editingDonor.status === "approved" ? "Update Amount" : "Verify & Approve Supporter"}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Enter the payment amount received from <strong>{editingDonor.name}</strong> to list them on the leaderboard.
            </p>

            <form onSubmit={handleVerifySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[var(--text-secondary)]">
                  Donation Amount (Rp)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--text-tertiary)]">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={verifyAmount}
                    onChange={(e) => setVerifyAmount(e.target.value)}
                    placeholder="Enter amount in Rp"
                    className="w-full rounded-xl pl-7 pr-3 py-2 text-sm outline-none bg-[var(--bg-base)] text-[var(--text-primary)] border border-[var(--border-color)] focus:border-[var(--link-color)] transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDonor(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingId !== null || !verifyAmount}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors disabled:opacity-50 ${
                    editingDonor.status === "approved"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-emerald-500 hover:bg-emerald-600"
                  }`}
                >
                  {submittingId ? "Saving..." : editingDonor.status === "approved" ? "Save Amount" : "Verify & Approve"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
