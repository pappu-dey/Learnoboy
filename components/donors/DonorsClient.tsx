"use client";

import { useState, useMemo } from "react";
import { DonateModal } from "@/components/layout/DonateModal";

export interface IDonor {
  _id: string;
  name: string;
  email: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

interface DonorsClientProps {
  initialDonors: IDonor[];
}

export function DonorsClient({ initialDonors }: DonorsClientProps) {
  const [donors, setDonors] = useState<IDonor[]>(initialDonors);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Refresh donors list
  const refreshDonors = async () => {
    try {
      const res = await fetch("/api/donors");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDonors(json.data);
      }
    } catch (err) {
      console.error("Error refreshing donors:", err);
    }
  };

  // Top 3 Donors calculation (since donors are sorted by amount desc already)
  const topDonors = useMemo(() => {
    return donors.slice(0, 3);
  }, [donors]);

  // Filtered donors based on search query (showing all approved supporters)
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) =>
      donor.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [donors, searchQuery]);

  // Pagination for all donors
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const paginatedDonors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDonors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDonors, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Podium formatting
  // Visual order: [2nd (Silver), 1st (Gold), 3rd (Bronze)]
  const podiumDonors = useMemo(() => {
    const result = [null, null, null] as (IDonor | null)[];
    if (topDonors[1]) result[0] = topDonors[1]; // 2nd place
    if (topDonors[0]) result[1] = topDonors[0]; // 1st place
    if (topDonors[2]) result[2] = topDonors[2]; // 3rd place
    return result;
  }, [topDonors]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* ── Hero Banner ── */}
      <div
        className="text-center py-16 px-6 rounded-3xl mb-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(245,158,11,0.06) 100%)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[var(--link-color)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
        <span className="text-4xl sm:text-5xl mb-4 inline-block animate-bounce">🏆</span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-4">
          LearnoBoy Honor Roll
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
          We are committed to keeping high-quality programming education completely free and open. Meet the generous supporters who make this mission possible!
        </p>
        <button
          onClick={() => setShowDonateModal(true)}
          className="px-8 py-3.5 rounded-2xl text-sm font-extrabold text-white transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
            boxShadow: "0 6px 20px rgba(245, 158, 11, 0.3)",
          }}
        >
          Support Us & Join the List 💖
        </button>
      </div>

      {/* ── Top Donors Podium (Olympics Style) ── */}
      {topDonors.length > 0 && (
        <div className="mb-16">
          <h2 className="text-center text-xl font-bold text-[var(--text-primary)] mb-10 flex items-center justify-center gap-2">
            <span>✨</span> Our Top Supporters <span>✨</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto items-end pt-12 px-4">
            
            {/* 2nd Place: Silver */}
            {podiumDonors[0] ? (
              <div className="flex flex-col items-center order-2 md:order-1 mt-6 md:mt-0 transition-transform duration-300 hover:translate-y-[-6px]">
                <div className="w-16 h-16 rounded-full border-4 border-slate-300 dark:border-slate-500 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-2xl shadow-lg relative mb-4">
                  🥈
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 text-[9px] font-bold text-slate-800 dark:text-slate-100 bg-slate-300 dark:bg-slate-600 px-2 py-0.5 rounded-full shadow-sm">
                    2ND
                  </span>
                </div>
                <div className="text-center w-full max-w-[200px] mb-3">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {podiumDonors[0].name}
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    Supporter
                  </span>
                </div>
                <div
                  className="w-full rounded-t-2xl py-8 px-4 flex flex-col items-center justify-center border-t border-x border-[var(--border-color)] shadow-md"
                  style={{
                    background: "linear-gradient(180deg, var(--bg-surface) 0%, rgba(148, 163, 184, 0.08) 100%)",
                    height: "120px",
                  }}
                >
                  <span className="text-2xl font-black text-slate-400">Rp {podiumDonors[0]?.amount.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold mt-1">Donated</span>
                </div>
              </div>
            ) : (
              <div className="hidden md:block order-2 md:order-1 h-[120px]" />
            )}

            {/* 1st Place: Gold */}
            {podiumDonors[1] ? (
              <div className="flex flex-col items-center order-1 md:order-2 transition-transform duration-300 hover:translate-y-[-8px]">
                <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-3xl shadow-xl relative mb-4 animate-pulse" style={{ boxShadow: "0 0 25px rgba(245, 158, 11, 0.35)" }}>
                  🥇
                  <span className="absolute -top-3 right-1/2 translate-x-1/2 text-xl">👑</span>
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 text-[10px] font-black text-amber-950 bg-amber-400 px-2.5 py-0.5 rounded-full shadow-md">
                    CHAMPION
                  </span>
                </div>
                <div className="text-center w-full max-w-[220px] mb-3">
                  <h3 className="font-black text-base text-[var(--text-primary)] truncate">
                    {podiumDonors[1].name}
                  </h3>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">
                    Top Supporter
                  </span>
                </div>
                <div
                  className="w-full rounded-t-3xl py-10 px-4 flex flex-col items-center justify-center border-t-2 border-x border-amber-500/30 shadow-2xl relative"
                  style={{
                    background: "linear-gradient(180deg, var(--bg-surface) 0%, rgba(245, 158, 11, 0.1) 100%)",
                    height: "160px",
                  }}
                >
                  <span className="text-3xl font-black text-amber-500">Rp {podiumDonors[1]?.amount.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 uppercase font-black tracking-widest mt-1">Donated</span>
                </div>
              </div>
            ) : (
              <div className="hidden md:block order-1 md:order-2 h-[160px]" />
            )}

            {/* 3rd Place: Bronze */}
            {podiumDonors[2] ? (
              <div className="flex flex-col items-center order-3 transition-transform duration-300 hover:translate-y-[-4px]">
                <div className="w-16 h-16 rounded-full border-4 border-amber-750 dark:border-amber-900 bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-2xl shadow-lg relative mb-4">
                  🥉
                  <span className="absolute -bottom-2 right-1/2 translate-x-1/2 text-[9px] font-bold text-orange-950 dark:text-orange-100 bg-orange-300 dark:bg-orange-800 px-2 py-0.5 rounded-full shadow-sm">
                    3RD
                  </span>
                </div>
                <div className="text-center w-full max-w-[200px] mb-3">
                  <h3 className="font-bold text-sm text-[var(--text-primary)] truncate">
                    {podiumDonors[2].name}
                  </h3>
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    Supporter
                  </span>
                </div>
                <div
                  className="w-full rounded-t-2xl py-8 px-4 flex flex-col items-center justify-center border-t border-x border-[var(--border-color)] shadow-md"
                  style={{
                    background: "linear-gradient(180deg, var(--bg-surface) 0%, rgba(249, 115, 22, 0.08) 100%)",
                    height: "100px",
                  }}
                >
                  <span className="text-2xl font-black text-orange-600 dark:text-orange-400">Rp {podiumDonors[2]?.amount.toLocaleString("id-ID")}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)] uppercase font-semibold mt-1">Donated</span>
                </div>
              </div>
            ) : (
              <div className="hidden md:block order-3 h-[100px]" />
            )}

          </div>
        </div>
      )}

      {/* ── Search & Full List ── */}
      <div className="border border-[var(--border-color)] rounded-3xl p-6 md:p-8" style={{ background: "var(--bg-surface)" }}>
        
        {/* Search header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[var(--border-color)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              All Supporters ({donors.length})
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              A list of all members who contributed to keeping LearnoBoy alive.
            </p>
          </div>
          
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--text-tertiary)]">🔍</span>
            <input
              type="text"
              placeholder="Search donor name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page to 1
              }}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl text-xs border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)] transition-shadow"
            />
          </div>
        </div>

        {/* List Content */}
        {filteredDonors.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-3xl mb-3 block">🤍</span>
            <p className="font-semibold text-sm text-[var(--text-primary)]">
              {searchQuery ? "No donors match your search." : "No additional donors yet."}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs mx-auto">
              {searchQuery
                ? "Double check spelling or try another keyword."
                : "Be the first on the list by clicking Support Us!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedDonors.map((donor) => (
                <div
                  key={donor._id}
                  className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-base)] flex items-center justify-between transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--link-color)]/10 text-[var(--link-color)] flex items-center justify-center font-black text-sm">
                      {donor.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-[var(--text-primary)]">
                        {donor.name}
                      </h3>
                      <span className="text-[10px] text-[var(--text-tertiary)]">
                        {new Date(donor.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-black text-sm text-[var(--text-primary)]">
                      Rp {donor.amount.toLocaleString("id-ID")}
                    </span>
                    <p className="text-[9px] uppercase font-bold tracking-wider text-emerald-500">
                      Donation
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-semibold hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-xs font-bold text-[var(--text-secondary)] px-2">
                  Page {currentPage} of {totalPages}
                </span>
                
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-semibold hover:bg-[var(--bg-muted)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Reusable Modal Integration ── */}
      {showDonateModal && (
        <DonateModal
          onClose={() => setShowDonateModal(false)}
          onSuccess={refreshDonors}
        />
      )}
    </div>
  );
}
