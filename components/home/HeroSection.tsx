"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Code2, Zap, Search, StickyNote, Share2, Compass, X, ChevronRight, ArrowRight, Star, BookMarked, Users } from "lucide-react";

// ---------- 3D floating illustration ----------
function FloatingIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 340 }}>
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0px) rotate(-6deg)} 50%{transform:translateY(-14px) rotate(-4deg)} }
        @keyframes float2 { 0%,100%{transform:translateY(0px) rotate(6deg)} 50%{transform:translateY(-10px) rotate(8deg)} }
        @keyframes float3 { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-18px)} }
        @keyframes float4 { 0%,100%{transform:translateY(0px) rotate(3deg)} 50%{transform:translateY(-8px) rotate(1deg)} }
        @keyframes spin3d { 0%{transform:rotateY(0deg)} 100%{transform:rotateY(360deg)} }
        @keyframes pulse-glow { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.9;transform:scale(1.08)} }
        .card-3d { transform-style: preserve-3d; perspective: 800px; }
        .card-3d:hover { transform: rotateY(-6deg) rotateX(4deg) scale(1.03); transition: transform 0.4s ease; }
      `}</style>

      {/* Glow orb */}
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)",
        animation: "pulse-glow 4s ease-in-out infinite"
      }} />

      {/* Main code editor card */}
      <div className="card-3d" style={{
        position: "relative", zIndex: 10,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: 16, padding: "20px 24px", width: 280,
        boxShadow: "0 32px 64px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.1)",
        animation: "float3 5s ease-in-out infinite"
      }}>
        {/* Window chrome */}
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        {/* Code lines */}
        {[
          { indent: 0, parts: [{ t: "const ", c: "#c792ea" }, { t: "learn", c: "#82aaff" }, { t: " = () => {", c: "#cdd6f4" }] },
          { indent: 1, parts: [{ t: "await ", c: "#c792ea" }, { t: "fetchTopics", c: "#82aaff" }, { t: "()", c: "#cdd6f4" }] },
          { indent: 1, parts: [{ t: "notes", c: "#a6e3a1" }, { t: ".", c: "#cdd6f4" }, { t: "save", c: "#89dceb" }, { t: "()", c: "#cdd6f4" }] },
          { indent: 1, parts: [{ t: "return ", c: "#c792ea" }, { t: "knowledge", c: "#f9e2af" }] },
          { indent: 0, parts: [{ t: "}", c: "#cdd6f4" }] },
        ].map((line, i) => (
          <div key={i} style={{ display: "flex", marginBottom: 5, paddingLeft: line.indent * 16 }}>
            <span style={{ color: "#4a5568", fontSize: 11, marginRight: 12, minWidth: 14, fontFamily: "monospace" }}>{i + 1}</span>
            {line.parts.map((p, j) => (
              <span key={j} style={{ color: p.c, fontSize: 12, fontFamily: "monospace" }}>{p.t}</span>
            ))}
          </div>
        ))}
        {/* Cursor blink */}
        <div style={{ display: "flex", paddingLeft: 16 + 14 }}>
          <span style={{ color: "#4a5568", fontSize: 11, marginRight: 12, minWidth: 14, fontFamily: "monospace" }}>6</span>
          <span style={{
            display: "inline-block", width: 7, height: 14, background: "#82aaff",
            animation: "pulse-glow 1s ease-in-out infinite", borderRadius: 2
          }} />
        </div>
      </div>

      {/* Floating note card TL */}
      <div style={{
        position: "absolute", top: 20, left: 20, zIndex: 20,
        background: "linear-gradient(135deg, #fef9c3, #fef08a)",
        borderRadius: 10, padding: "10px 14px", width: 130,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        animation: "float1 4.5s ease-in-out infinite"
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#854d0e", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>My Note</div>
        <div style={{ fontSize: 11, color: "#713f12", lineHeight: 1.4 }}>Binary search: O(log n) — remember halving!</div>
      </div>

      {/* Floating topic badge TR */}
      <div style={{
        position: "absolute", top: 30, right: 10, zIndex: 20,
        background: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
        borderRadius: 50, padding: "8px 14px",
        boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
        display: "flex", alignItems: "center", gap: 7,
        animation: "float2 3.8s ease-in-out infinite"
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
        <span style={{ fontSize: 12, fontWeight: 600, color: "#1e40af" }}>Algorithms</span>
      </div>

      {/* Floating share card BL */}
      <div style={{
        position: "absolute", bottom: 30, left: 10, zIndex: 20,
        background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
        borderRadius: 12, padding: "10px 14px", minWidth: 140,
        boxShadow: "0 8px 24px rgba(22,163,74,0.2)",
        animation: "float4 5.2s ease-in-out infinite"
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#166534", marginBottom: 5, textTransform: "uppercase", letterSpacing: 1 }}>Shared Notes</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          {["#2563eb", "#7c3aed", "#db2777"].map((c, i) => (
            <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: c, border: "2px solid white", marginLeft: i > 0 ? -6 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 8, color: "white", fontWeight: 700 }}>{["A", "B", "C"][i]}</span>
            </div>
          ))}
          <span style={{ fontSize: 11, color: "#166534", marginLeft: 4 }}>+42 learners</span>
        </div>
      </div>

      {/* Floating progress BR */}
      <div style={{
        position: "absolute", bottom: 20, right: 8, zIndex: 20,
        background: "white",
        borderRadius: 12, padding: "10px 14px", minWidth: 130,
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        animation: "float1 6s ease-in-out infinite reverse"
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Progress</div>
        <div style={{ background: "#f3f4f6", borderRadius: 100, height: 6, marginBottom: 4 }}>
          <div style={{ width: "72%", height: 6, borderRadius: 100, background: "linear-gradient(90deg,#2563eb,#60a5fa)" }} />
        </div>
        <div style={{ fontSize: 11, color: "#6b7280" }}>72% complete</div>
      </div>
    </div>
  );
}

// ---------- Topic Finder Modal ----------
const TOPICS = [
  { icon: Code2, name: "Data Structures", count: 84, color: "#2563eb" },
  { icon: Zap, name: "Algorithms", count: 67, color: "#7c3aed" },
  { icon: BookOpen, name: "Web Development", count: 120, color: "#059669" },
  { icon: Star, name: "System Design", count: 45, color: "#d97706" },
  { icon: Compass, name: "Computer Science", count: 93, color: "#db2777" },
  { icon: BookMarked, name: "Machine Learning", count: 58, color: "#0891b2" },
];

function TopicFinder({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const filtered = TOPICS.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "var(--card-bg,#fff)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>Find a Topic</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-secondary)" }}>
            <X size={20} />
          </button>
        </div>
        <input
          autoFocus value={q} onChange={e => setQ(e.target.value)}
          placeholder="Search topics…"
          style={{
            width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid rgba(37,99,235,0.25)",
            fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16,
            background: "rgba(37,99,235,0.04)"
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {filtered.map(t => (
            <div key={t.name} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", borderRadius: 12,
              border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer",
              transition: "all 0.15s", background: "rgba(0,0,0,0.02)"
            }}
              onMouseEnter={e => (e.currentTarget.style.background = `${t.color}12`)}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
            >
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${t.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <t.icon size={16} style={{ color: t.color }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>{t.count} articles</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Notes Panel ----------
function NotesPanel({ onClose }: { onClose: () => void }) {
  const [notes, setNotes] = useState("💡 Binary search runs in O(log n) time.\n\n📌 Remember: always check edge cases!");
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fffdf0", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)", border: "1px solid #fde68a"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#78350f" }}>📓 My Notes</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#92400e" }}><X size={20} /></button>
        </div>
        <textarea
          value={notes} onChange={e => setNotes(e.target.value)}
          rows={8} style={{
            width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #fcd34d",
            fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none",
            background: "rgba(254,243,199,0.4)", boxSizing: "border-box", lineHeight: 1.6, color: "#78350f"
          }}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button style={{
            flex: 1, padding: "10px 0", borderRadius: 10, background: "#f59e0b", color: "white",
            border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer"
          }}>Save Note</button>
          <button style={{
            padding: "10px 14px", borderRadius: 10, background: "none", color: "#92400e",
            border: "1.5px solid #fcd34d", fontWeight: 600, fontSize: 14, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6
          }}>
            <Share2 size={14} /> Share
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- Share Modal ----------
function ShareModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = "https://learncode.dev/articles/binary-search";
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "white", borderRadius: 20, padding: 28, width: "100%", maxWidth: 400,
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Share this resource</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
        </div>
        {[
          { label: "Twitter/X", bg: "#000", emoji: "𝕏" },
          { label: "LinkedIn", bg: "#0a66c2", emoji: "in" },
          { label: "WhatsApp", bg: "#25d366", emoji: "💬" },
        ].map(s => (
          <div key={s.label} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12,
            border: "1px solid #e5e7eb", cursor: "pointer", marginBottom: 8
          }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 700 }}>
              {s.emoji}
            </div>
            <span style={{ fontWeight: 500, fontSize: 14 }}>Share on {s.label}</span>
            <ChevronRight size={14} style={{ marginLeft: "auto", color: "#9ca3af" }} />
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center", padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb" }}>
          <span style={{ fontSize: 12, color: "#6b7280", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{url}</span>
          <button
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }}
            style={{
              padding: "6px 12px", borderRadius: 8, background: copied ? "#10b981" : "#2563eb",
              color: "white", border: "none", fontWeight: 600, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
              transition: "background 0.2s"
            }}
          >{copied ? "Copied!" : "Copy"}</button>
        </div>
      </div>
    </div>
  );
}

// ---------- Main HeroSection ----------
export function HeroSection() {
  const router = useRouter();
  const [modal, setModal] = useState<"topic" | "notes" | "share" | null>(null);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchArticles = async (q: string) => {
    if (q.trim().length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`);
      const data = await res.json();
      setResults(data.data || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchArticles(val), 150);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?q=${encodeURIComponent(search.trim())}`);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", padding: "60px 0" }}
      aria-label="Hero"
    >
      <style>{`
        @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-in { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes bounce-dot { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .action-btn { transition: all 0.2s; }
        .action-btn:hover { transform: translateY(-2px); }
        .hero-tag { animation: slide-in 0.5s ease both; }
        .hero-h1 { animation: fade-up 0.6s 0.1s ease both; }
        .hero-sub { animation: fade-up 0.6s 0.2s ease both; }
        .hero-search { animation: fade-up 0.6s 0.3s ease both; }
        .hero-actions { animation: fade-up 0.6s 0.4s ease both; }
        .hero-stats { animation: fade-up 0.6s 0.5s ease both; }
        .search-wrap:focus-within { box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }

        .hero-search-form {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid rgba(37,99,235,0.2);
          border-radius: 14px;
          padding: 6px 6px 6px 16px;
          margin-bottom: 24px;
          max-width: 500px;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
          transition: all 0.2s;
        }
        .dark .hero-search-form {
          background: #1e293b;
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          padding: 4px 12px;
          color: #1e293b;
        }
        .dark .hero-search-input {
          color: #ffffff;
        }
        .hero-search-input::placeholder {
          color: #9ca3af;
        }
        .dark .hero-search-input::placeholder {
          color: #64748b;
        }
        .hero-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 6px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          z-index: 50;
          overflow: hidden;
          text-align: left;
        }
        .dark .hero-dropdown {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }
        .hero-dropdown-item {
          display: flex;
          flex-direction: column;
          padding: 10px 16px;
          border-bottom: 1px solid #f1f5f9;
          text-decoration: none;
          transition: background 0.15s;
        }
        .dark .hero-dropdown-item {
          border-bottom-color: #334155;
        }
        .hero-dropdown-item:last-child {
          border-bottom: none;
        }
        .hero-dropdown-item:hover {
          background: #f8fafc;
        }
        .dark .hero-dropdown-item:hover {
          background: #334155;
        }
      `}</style>

      {/* bg radial */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 30% -10%, rgba(37,99,235,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(124,58,237,0.07) 0%, transparent 55%)"
      }} />

      <div style={{ width: "100%", maxWidth: 1280, margin: "0 auto", padding: "0 24px", position: "relative" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>

          {/* LEFT */}
          <div>
            {/* badge */}


            {/* H1 */}
            <h1 className="hero-h1" style={{
              fontWeight: 800, lineHeight: 1.1, marginBottom: 20,
              fontSize: "clamp(34px,4.5vw,58px)", color: "var(--text-primary)"
            }}>
              Learn to Code,{" "}
              <span style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #60a5fa 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
              }}>
                Build the Future
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-sub" style={{
              fontSize: 17, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.7, maxWidth: 480
            }}>
              Expert articles on programming, data structures, web development, and CS — crafted for clarity and built for builders.
            </p>

            {/* Search */}
            <div style={{ position: "relative", maxWidth: 500 }}>
              <form onSubmit={handleSearchSubmit} className="hero-search-form search-wrap">
                <Search size={16} style={{ color: "#9ca3af", flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={handleSearchChange}
                  onFocus={() => search.trim() && setIsOpen(true)}
                  placeholder="Search 1000+ articles, tutorials, guides…"
                  className="hero-search-input"
                />
                
                {search && isLoading && (
                  <svg className="animate-spin h-4 w-4 mr-2" style={{ color: "#2563eb" }} viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}

                <button type="submit" style={{
                  background: "linear-gradient(135deg,#2563eb,#4f46e5)", color: "white",
                  border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6
                }}>
                  Search <ArrowRight size={13} />
                </button>
              </form>

              {/* Suggestions Dropdown */}
              {isOpen && results.length > 0 && (
                <div ref={dropdownRef} className="hero-dropdown animate-fade-in">
                  {results.map((article) => {
                    const category = typeof article.category === "object" ? article.category : null;
                    return (
                      <a
                        key={article._id}
                        href={`/${category?.slug || "articles"}/${article.slug}`}
                        className="hero-dropdown-item"
                      >
                        <span className="text-xs font-semibold mb-0.5" style={{ color: category?.color || "#2563eb" }}>
                          {category?.name || "Article"}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                          {article.title}
                        </span>
                        <span style={{ fontSize: 11, color: "var(--text-secondary)", marginTop: 2 }}>
                          {article.readingTime} min read
                        </span>
                      </a>
                    );
                  })}
                  <a
                    href={`/search?q=${encodeURIComponent(search)}`}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                      padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#2563eb",
                      textDecoration: "none", background: "rgba(37,99,235,0.04)"
                    }}
                  >
                    <Search size={13} />
                    See all results for &ldquo;{search}&rdquo;
                  </a>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="hero-actions" style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {[
                { icon: Compass, label: "Find Topic", color: "#2563eb", bg: "rgba(37,99,235,0.08)", modal: "topic" as const },
                { icon: StickyNote, label: "My Notes", color: "#d97706", bg: "rgba(217,119,6,0.08)", modal: "notes" as const },
                { icon: Share2, label: "Share", color: "#059669", bg: "rgba(5,150,105,0.08)", modal: "share" as const },
                { icon: BookMarked, label: "Bookmarks", color: "#7c3aed", bg: "rgba(124,58,237,0.08)", modal: null },
                { icon: Users, label: "Community", color: "#db2777", bg: "rgba(219,39,119,0.08)", modal: null },
              ].map(btn => (
                <button
                  key={btn.label}
                  className="action-btn"
                  onClick={() => btn.modal && setModal(btn.modal)}
                  style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "8px 16px", borderRadius: 50,
                    border: `1.5px solid ${btn.color}30`, background: btn.bg,
                    color: btn.color, fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}
                >
                  <btn.icon size={14} />{btn.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="hero-stats" style={{ display: "flex", gap: 28 }}>
              {[
                { icon: BookOpen, value: "1,000+", label: "Articles" },
                { icon: Code2, value: "50+", label: "Topics" },
                { icon: Users, value: "100K+", label: "Learners" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                    <s.icon size={14} style={{ color: "#2563eb" }} />
                    <span style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)" }}>{s.value}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — 3D illustration */}
          <div style={{ position: "relative" }}>
            <FloatingIllustration />
          </div>

        </div>
      </div>



      {/* Modals */}
      {modal === "topic" && <TopicFinder onClose={() => setModal(null)} />}
      {modal === "notes" && <NotesPanel onClose={() => setModal(null)} />}
      {modal === "share" && <ShareModal onClose={() => setModal(null)} />}
    </section>
  );
}