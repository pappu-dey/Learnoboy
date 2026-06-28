"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Code2, Search, ArrowRight, Users } from "lucide-react";











function FloatingIllustration() {
  return (
    <div style={{ width: "100%", maxWidth: 520, margin: "0 auto" }}>
      <style>{`
        @keyframes svgF1 { 0%,100%{transform:translateY(0)   rotate(-4deg)} 50%{transform:translateY(-11px) rotate(-2deg)} }
        @keyframes svgF2 { 0%,100%{transform:translateY(0)   rotate( 4deg)} 50%{transform:translateY(-9px)  rotate( 6deg)} }
        @keyframes svgF3 { 0%,100%{transform:translateY(0)}                 50%{transform:translateY(-15px)} }
        @keyframes svgF4 { 0%,100%{transform:translateY(0)   rotate( 2deg)} 50%{transform:translateY(-8px)  rotate( 0deg)} }
        @keyframes svgGl { 0%,100%{opacity:0.45} 50%{opacity:0.9} }
        @keyframes svgBl { 0%,49%{opacity:1} 50%,100%{opacity:0} }

        /* transform-origin in SVG coords = centre of each element */
        .ill-editor  { animation: svgF3 5s   ease-in-out infinite; transform-origin: 250px 210px; }
        .ill-note    { animation: svgF1 4.5s ease-in-out infinite; transform-origin:  82px  54px; }
        .ill-badge   { animation: svgF2 3.8s ease-in-out infinite; transform-origin: 404px  41px; }
        .ill-shared  { animation: svgF4 5.2s ease-in-out infinite; transform-origin: 103px 366px; }
        .ill-progress{ animation: svgF1 6s   ease-in-out infinite reverse; transform-origin: 409px 364px; }
        .ill-glow    { animation: svgGl 4s   ease-in-out infinite; }
        .ill-cursor  { animation: svgBl 1.1s step-end  infinite; }
      `}</style>

      <svg
        viewBox="0 0 500 420"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto", display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ill-glow-g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ill-editor-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <linearGradient id="ill-note-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fef9c3" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
          <linearGradient id="ill-badge-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          <linearGradient id="ill-shared-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0fdf4" />
            <stop offset="100%" stopColor="#dcfce7" />
          </linearGradient>
          <linearGradient id="ill-bar-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#60a5fa" />
          </linearGradient>
          <filter id="ill-shadow-sm" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="5" stdDeviation="8" floodColor="#000" floodOpacity="0.22" />
          </filter>
          <filter id="ill-shadow-lg" x="-25%" y="-25%" width="150%" height="150%">
            <feDropShadow dx="0" dy="14" stdDeviation="22" floodColor="#000" floodOpacity="0.5" />
          </filter>
        </defs>

        {}
        <ellipse className="ill-glow" cx="250" cy="210" rx="175" ry="155" fill="url(#ill-glow-g)" />

        {}
        <g className="ill-editor" filter="url(#ill-shadow-lg)">
          {}
          <rect x="148" y="108" width="204" height="204" rx="14" fill="url(#ill-editor-g)"
            stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
          {}
          <rect x="149" y="109" width="202" height="1" rx="0.5" fill="rgba(255,255,255,0.09)" />
          {}
          <circle cx="170" cy="129" r="5.5" fill="#ff5f57" />
          <circle cx="185" cy="129" r="5.5" fill="#ffbd2e" />
          <circle cx="200" cy="129" r="5.5" fill="#28ca41" />
          {}
          {[0, 1, 2, 3, 4, 5].map(i => (
            <text key={i} x="166" y={150 + i * 22} fontFamily="monospace" fontSize="10"
              fill="#3d5068" textAnchor="end">{i + 1}</text>
          ))}
          {}
          <text x="172" y="150" fontFamily="monospace" fontSize="11.5">
            <tspan fill="#c792ea">const </tspan><tspan fill="#82aaff">learn</tspan><tspan fill="#cdd6f4">{" = () => {"}</tspan>
          </text>
          {}
          <text x="188" y="172" fontFamily="monospace" fontSize="11.5">
            <tspan fill="#c792ea">await </tspan><tspan fill="#82aaff">fetchTopics</tspan><tspan fill="#cdd6f4">()</tspan>
          </text>
          {}
          <text x="188" y="194" fontFamily="monospace" fontSize="11.5">
            <tspan fill="#a6e3a1">notes</tspan><tspan fill="#cdd6f4">.</tspan><tspan fill="#89dceb">save</tspan><tspan fill="#cdd6f4">()</tspan>
          </text>
          {}
          <text x="188" y="216" fontFamily="monospace" fontSize="11.5">
            <tspan fill="#c792ea">return </tspan><tspan fill="#f9e2af">knowledge</tspan>
          </text>
          {}
          <text x="172" y="238" fontFamily="monospace" fontSize="11.5" fill="#cdd6f4">{"}"}</text>
          {}
          <rect className="ill-cursor" x="172" y="248" width="7" height="13" rx="1" fill="#82aaff" />
        </g>

        {}
        <g className="ill-note" filter="url(#ill-shadow-sm)">
          <rect x="8" y="16" width="148" height="76" rx="10" fill="url(#ill-note-g)" />
          <text x="22" y="35" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700"
            fill="#854d0e" letterSpacing="0.9">MY NOTE</text>
          <text x="22" y="54" fontFamily="system-ui,sans-serif" fontSize="12" fill="#713f12">Binary search:</text>
          <text x="22" y="72" fontFamily="system-ui,sans-serif" fontSize="12" fill="#713f12">O(log n) — halving!</text>
        </g>

        {}
        <g className="ill-badge" filter="url(#ill-shadow-sm)">
          <rect x="328" y="22" width="152" height="38" rx="19" fill="url(#ill-badge-g)" />
          <circle cx="351" cy="41" r="5" fill="#2563eb" />
          <text x="363" y="45" fontFamily="system-ui,sans-serif" fontSize="12.5" fontWeight="600"
            fill="#1e40af">Algorithms</text>
        </g>

        {}
        <g className="ill-shared" filter="url(#ill-shadow-sm)">
          <rect x="8" y="330" width="190" height="72" rx="12" fill="url(#ill-shared-g)" />
          <text x="22" y="350" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700"
            fill="#166534" letterSpacing="0.9">SHARED NOTES</text>
          {}
          <circle cx="34" cy="377" r="13" fill="#2563eb" stroke="#f0fdf4" strokeWidth="2.5" />
          <circle cx="53" cy="377" r="13" fill="#7c3aed" stroke="#f0fdf4" strokeWidth="2.5" />
          <circle cx="72" cy="377" r="13" fill="#db2777" stroke="#f0fdf4" strokeWidth="2.5" />
          <text x="34" y="381" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8.5" fontWeight="700" fill="white">A</text>
          <text x="53" y="381" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8.5" fontWeight="700" fill="white">B</text>
          <text x="72" y="381" textAnchor="middle" fontFamily="system-ui,sans-serif" fontSize="8.5" fontWeight="700" fill="white">C</text>
          <text x="92" y="381" fontFamily="system-ui,sans-serif" fontSize="11.5" fontWeight="600" fill="#166534">+42 learners</text>
        </g>

        {}
        <g className="ill-progress" filter="url(#ill-shadow-sm)">
          <rect x="330" y="326" width="158" height="76" rx="12" fill="white" />
          <text x="344" y="346" fontFamily="system-ui,sans-serif" fontSize="9" fontWeight="700"
            fill="#6b7280" letterSpacing="0.9">PROGRESS</text>
          {}
          <rect x="344" y="356" width="130" height="8" rx="4" fill="#f3f4f6" />
          {}
          <rect x="344" y="356" width="94" height="8" rx="4" fill="url(#ill-bar-g)" />
          <text x="344" y="384" fontFamily="system-ui,sans-serif" fontSize="11.5" fontWeight="500" fill="#6b7280">72% complete</text>
        </g>

      </svg>
    </div>
  );
}


export function HeroSection() {
  const router = useRouter();
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
      className="hero-section"
      aria-label="Hero"
    >
      <style>{`
        @keyframes fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slide-in { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }

        .hero-section {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          /* Tighter on mobile, full on desktop */
          padding: 36px 0 28px;
          min-height: calc(100vh - 64px);
        }
        @media (min-width: 1024px) {
          .hero-section { padding: 60px 0; }
        }

        /* fade-up animation helpers */
        .anim-fade-up { animation: fade-up 0.6s ease both; }
        .anim-delay-1 { animation-delay: 0.1s; }
        .anim-delay-2 { animation-delay: 0.2s; }
        .anim-delay-3 { animation-delay: 0.3s; }
        .anim-delay-4 { animation-delay: 0.4s; }

        /* ---- Layout grid ---- */
        .hero-grid {
          display: flex;
          flex-direction: column;
          gap: 0;                /* illustration sits directly below on mobile */
          align-items: center;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px;
        }
        @media (min-width: 1024px) {
          .hero-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 48px;
            padding: 0 24px;
          }
        }

        /* ---- Content block ---- */
        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          width: 100%;
          order: 1; /* content first on mobile */
        }
        @media (min-width: 1024px) {
          .hero-content {
            align-items: flex-start;
            text-align: left;
          }
        }

        /* ---- Title ---- */
        .hero-title {
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 16px;
          /* Fluid type: small phones → 30px, large desktops → 58px */
          font-size: clamp(28px, 7vw, 58px);
          color: var(--text-primary, #0f172a);
        }
        @media (min-width: 480px) {
          .hero-title { margin-bottom: 20px; }
        }

        /* ---- Subtitle ---- */
        .hero-subtitle {
          font-size: clamp(14px, 3.5vw, 17px);
          color: var(--text-secondary, #64748b);
          line-height: 1.7;
          max-width: 480px;
          margin: 0 auto 24px;
        }
        @media (min-width: 1024px) {
          .hero-subtitle { margin: 0 0 28px; }
        }

        /* ---- Search box wrapper ---- */
        .hero-search-box {
          position: relative;
          width: 100%;
          max-width: 500px;
          margin: 0 auto 24px;
        }
        @media (min-width: 1024px) {
          .hero-search-box { margin: 0 0 24px; }
        }

        /* ---- Search form pill ---- */
        .hero-search-form {
          display: flex;
          align-items: center;
          background: #ffffff;
          border: 1.5px solid rgba(37,99,235,0.2);
          border-radius: 14px;
          /* Tighter padding on mobile so the button doesn't get squished */
          padding: 5px 5px 5px 12px;
          box-shadow: 0 4px 20px rgba(37,99,235,0.08);
          transition: box-shadow 0.2s;
          /* prevent overflow on tiny screens */
          min-width: 0;
        }
        .hero-search-form:focus-within {
          box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
        }
        .dark .hero-search-form {
          background: #1e293b;
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }

        /* ---- Search input ---- */
        .hero-search-input {
          flex: 1;
          min-width: 0; /* critical — prevents flex overflow */
          border: none;
          outline: none;
          background: transparent;
          font-size: clamp(12px, 3vw, 14px);
          padding: 4px 8px;
          color: #1e293b;
        }
        .dark .hero-search-input { color: #ffffff; }
        .hero-search-input::placeholder { color: #9ca3af; }
        .dark .hero-search-input::placeholder { color: #64748b; }

        /* ---- Search submit button ---- */
        .hero-search-btn {
          background: linear-gradient(135deg,#2563eb,#4f46e5);
          color: white;
          border: none;
          border-radius: 10px;
          /* shrinks text on very small screens */
          padding: 8px 12px;
          font-size: clamp(11px, 2.5vw, 13px);
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .hero-search-btn:hover { opacity: 0.9; }
        /* On tiny screens, collapse button to icon only */
        .hero-search-btn-label {
          display: none;
        }
        @media (min-width: 400px) {
          .hero-search-btn-label { display: inline; }
          .hero-search-btn { padding: 8px 14px; }
        }

        /* ---- Dropdown ---- */
        .hero-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 6px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          background: #ffffff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.12);
          z-index: 50;
          overflow: hidden;
          text-align: left;
          /* ensure it can't overflow screen width */
          max-width: 100%;
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
          cursor: pointer;
        }
        .dark .hero-dropdown-item { border-bottom-color: #334155; }
        .hero-dropdown-item:last-child { border-bottom: none; }
        .hero-dropdown-item:hover { background: #f8fafc; }
        .dark .hero-dropdown-item:hover { background: #334155; }

        /* ---- Stats row ---- */
        .hero-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          width: 100%;
        }
        @media (min-width: 1024px) {
          .hero-stats {
            justify-content: flex-start;
            gap: 28px;
          }
        }
        .hero-stat-item {
          text-align: center;
          /* avoid stats getting too compressed */
          min-width: 60px;
        }

        /* ---- Illustration wrapper ---- */
        /* SVG uses viewBox + width:100% so it intrinsically sizes itself.
           Just control order, max-width and spacing. */
        .hero-illustration-wrapper {
          order: 2;
          width: 100%;
          max-width: 480px;
          margin: 4px auto 0;
          padding: 0 8px;
        }
        @media (min-width: 1024px) {
          .hero-illustration-wrapper {
            order: unset;
            max-width: none;
            margin: 0;
            padding: 0;
          }
        }
      `}</style>

      {}
      <div aria-hidden style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 70% 60% at 30% -10%, rgba(37,99,235,0.1) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 80% 60%, rgba(124,58,237,0.07) 0%, transparent 55%)"
      }} />

      <div className="hero-grid">

        {}
        <div className="hero-content">
          {}
          <h1 className="hero-title anim-fade-up anim-delay-1">
            Learn to Code,{" "}
            <span style={{
              background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 50%, #60a5fa 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Build the Future
            </span>
          </h1>

          {}
          <p className="hero-subtitle anim-fade-up anim-delay-2">
            Expert articles on programming, data structures, web development, and CS — crafted for clarity and built for builders.
          </p>

          {}
          <div className="hero-search-box anim-fade-up anim-delay-3" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="hero-search-form">
              <Search size={15} style={{ color: "#9ca3af", flexShrink: 0 }} />
              <input
                value={search}
                onChange={handleSearchChange}
                onFocus={() => search.trim() && setIsOpen(true)}
                placeholder="Search articles, tutorials…"
                className="hero-search-input"
                aria-label="Search articles"
              />

              {search && isLoading && (
                <svg className="animate-spin h-4 w-4 mr-1" style={{ color: "#2563eb", flexShrink: 0 }} viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}

              <button type="submit" className="hero-search-btn">
                <span className="hero-search-btn-label">Search</span>
                <ArrowRight size={13} />
              </button>
            </form>

            {}
            {isOpen && results.length > 0 && (
              <div className="hero-dropdown">
                {results.map((article) => {
                  const category = typeof article.category === "object" ? article.category : null;
                  return (
                    <a
                      key={article._id}
                      href={article.primaryCategory && article.subcategory
                        ? `/${article.primaryCategory}/${article.subcategory}/${article.slug}`
                        : `/${category?.slug || "articles"}/${article.slug}`}
                      className="hero-dropdown-item"
                    >
                      <span style={{ fontSize: 11, fontWeight: 600, marginBottom: 2, color: category?.color || "#2563eb" }}>
                        {category?.name || "Article"}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary, #0f172a)" }}>
                        {article.title}
                      </span>
                      <span style={{ fontSize: 11, color: "var(--text-secondary, #64748b)", marginTop: 2 }}>
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

          {}
          <div className="hero-stats anim-fade-up anim-delay-4">
            {[
              { icon: BookOpen, value: "1,000+", label: "Articles" },
              { icon: Code2, value: "50+", label: "Topics" },
              { icon: Users, value: "100K+", label: "Learners" },
            ].map(s => (
              <div key={s.label} className="hero-stat-item">
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                  <s.icon size={13} style={{ color: "#2563eb" }} />
                  <span style={{ fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 800, color: "var(--text-primary, #0f172a)" }}>{s.value}</span>
                </div>
                <span style={{ fontSize: 11, color: "var(--text-secondary, #64748b)" }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {}
        <div className="hero-illustration-wrapper">
          <FloatingIllustration />
        </div>

      </div>
    </section>
  );
}