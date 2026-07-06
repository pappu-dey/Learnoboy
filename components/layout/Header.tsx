"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LayoutDashboard,
  ChevronDown,
  LogOut,
  User as UserIcon,
  PenLine,
  Terminal,
  Database,
  Braces,
  Code2,
  Sparkles,
  Layers,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";


interface SubCategoryItem {
  name: string;
  slug: string;
  desc: string;
  href?: string;
}

interface NavSection {
  label: string;
  slug: string;
  color: string;
  icon: React.ReactNode;
  items: SubCategoryItem[];
}

const NAVIGATION_ITEMS: NavSection[] = [
  {
    label: "Coding",
    slug: "coding",
    color: "#2563eb", 
    icon: <Terminal size={14} />,
    items: [
      { name: "C", slug: "c", desc: "Low-level system programming & compiled logic" },
      { name: "C++", slug: "cpp", desc: "High-performance OOPs & STL structure" },
      { name: "Java", slug: "java", desc: "Enterprise robust cross-platform JVM apps" },
      { name: "Python", slug: "python", desc: "Clean scientific coding & scripting" },
      { name: "JavaScript", slug: "javascript", desc: "Interactive web logic & dynamic scripting" },
    ]
  },
  {
    label: "DSA",
    slug: "dsa",
    color: "#f97316", 
    icon: <Braces size={14} />,
    items: [
      { name: "Arrays", slug: "arrays", desc: "Linear static & dynamic arrays traversals" },
      { name: "Linked List", slug: "linked-list", desc: "Sequential node chain representations" },
      { name: "Stack", slug: "stack", desc: "LIFO structured call stack tracer algorithms" },
      { name: "Queue", slug: "queue", desc: "FIFO sequential item queue operations" },
      { name: "Tree", slug: "tree", desc: "Binary, BST, AVL & Segment trees" },
      { name: "Graph", slug: "graph", desc: "BFS, DFS, Dijkstra, & MST algorithms" },
      { name: "Dynamic Programming", slug: "dynamic-programming", desc: "Optimal sub-problem memoization" },
      { name: "Two Pointers", slug: "two-pointers", desc: "Optimal multi-pointer array searches" },
      { name: "Sliding Window", slug: "sliding-window", desc: "Sub-array sliding scanner patterns" },
    ]
  },
  {
    label: "Web Dev",
    slug: "web-development",
    color: "#06b6d4", 
    icon: <Code2 size={14} />,
    items: [
      { name: "HTML", slug: "html", desc: "Semantic page structure & markup tags" },
      { name: "CSS", slug: "css", desc: "Flexbox, CSS Grid, and responsive animation" },
      { name: "JavaScript", slug: "javascript", desc: "Dynamic interactive client browser events" },
      { name: "React", slug: "react", desc: "Declarative UI rendering hook states" },
      { name: "Next.js", slug: "nextjs", desc: "App Router SSR & statically optimized route pages" },
      { name: "Node.js", slug: "nodejs", desc: "Asynchronous backend runtime event loop" },
      { name: "Express.js", slug: "expressjs", desc: "Lightweight middleware REST API routing" },
      { name: "HTML Compiler", slug: "compiler/html", desc: "Live preview playground for HTML, CSS, JS", href: "/compiler/html" },
    ]
  },
  {
    label: "Database",
    slug: "database",
    color: "#ef4444", 
    icon: <Database size={14} />,
    items: [
      { name: "SQL", slug: "sql", desc: "Structured queries, join clauses & aggregates" },
      { name: "MySQL", slug: "mysql", desc: "Open-source RDBMS queries & performance" },
      { name: "MongoDB", slug: "mongodb", desc: "NoSQL document storage & aggregate pipelines" },
      { name: "PostgreSQL", slug: "postgresql", desc: "Enterprise relational database procedures" },
      { name: "DBMS", slug: "dbms", desc: "Normalization, transactions, & ACID properties" },
    ]
  },
  {
    label: "More",
    slug: "more",
    color: "#d946ef", 
    icon: <Sparkles size={14} />,
    items: [
      { name: "Operating Systems", slug: "operating-systems", desc: "Processes, threads, memory, & scheduling", href: "/cs-fundamentals/operating-systems" },
      { name: "Computer Networks", slug: "computer-networks", desc: "TCP/IP layers, routing, & sockets", href: "/cs-fundamentals/computer-networks" },
      { name: "Software Engineering", slug: "software-engineering", desc: "Systems engineering, Agile & patterns", href: "/cs-fundamentals/software-engineering" },
      { name: "Machine Learning", slug: "machine-learning", desc: "Supervised and unsupervised classifiers", href: "/machine-learning" },
      { name: "Cyber Security", slug: "cyber-security", desc: "Secure encryption, pen testing, & defense", href: "/cyber-security" },
      { name: "Interview Preparation", slug: "interview-preparation", desc: "Step-by-step coding and system design prep", href: "/coding/interview-preparation" },
      { name: "Roadmaps", slug: "roadmaps", desc: "Visual developer learning pathways", href: "/coding/roadmaps" },
      { name: "Projects", slug: "projects", desc: "Portfolio-worthy step-by-step developer projects", href: "/coding/projects" }
    ]
  }
];


interface UserInfo {
  name: string;
  email: string;
  role: "reader" | "writer" | "superadmin";
  avatar?: string;
}


function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 flex-shrink-0 group focus-visible:ring-2 focus-visible:ring-[var(--link-color)] rounded-xl"
      aria-label="LearnoBoy home"
    >
      {}
      <div
        className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
        style={{ width: 40, height: 40 }}
      >
        <Image
          src="/images/logo.png"
          alt="LearnoBoy"
          width={40}
          height={40}
          unoptimized
          loading="eager"
          fetchPriority="high"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            borderRadius: "28%",
          }}
        />
      </div>

      {}
      <div className="hidden sm:flex flex-col leading-none select-none">
        <span
          className="font-extrabold tracking-tight"
          style={{
            fontSize: "1.15rem",
            letterSpacing: "-0.02em",
            background: "linear-gradient(135deg, var(--link-color) 0%, #1e40af 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1.1,
          }}
        >
          Learno
          <span
            style={{
              fontWeight: 900,
              background: "linear-gradient(135deg, #1d4ed8 0%, #0d0643ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Boy
          </span>
        </span>
        <span
          className="text-[9px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--text-secondary)", opacity: 0.7, letterSpacing: "0.18em" }}
        >
          Learn · Code · Grow
        </span>
      </div>
    </Link>
  );
}


function AvatarCircle({
  user,
  size = 8,
}: {
  user: UserInfo;
  size?: number;
}) {
  const gradientByRole: Record<UserInfo["role"], string> = {
    superadmin: "linear-gradient(135deg, #7c3aed, #2563eb)",
    writer: "linear-gradient(135deg, #10b981, #059669)",
    reader: "linear-gradient(135deg, #2563eb, #1d4ed8)",
  };

  const px = size * 4;

  return (
    <div
      className="rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm overflow-hidden"
      style={{
        background: gradientByRole[user.role],
        width: `${px}px`,
        height: `${px}px`,
      }}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            style={{ width: "55%", height: "55%", fill: "#fff", opacity: 0.9 }}
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );
}


function RoleBadge({ role }: { role: UserInfo["role"] }) {
  const config = {
    superadmin: { label: "Super Admin", bg: "rgba(124,58,237,0.12)", color: "#7c3aed" },
    writer: { label: "Writer", bg: "rgba(16,185,129,0.12)", color: "#059669" },
    reader: { label: "Reader", bg: "rgba(37,99,235,0.10)", color: "#2563eb" },
  }[role];

  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
}


function UserProfileButton({ user }: { user: UserInfo }) {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-[var(--bg-surface)] group cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
        aria-label="User profile"
        aria-expanded={open}
      >
        <AvatarCircle user={user} size={8} />
        <ChevronDown
          size={14}
          className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
          }}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-2 w-60 rounded-2xl shadow-2xl z-50 overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            }}
          >
            {}
            <div
              className="px-4 py-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f1e4a 0%, #1a3070 60%, #1e3a8a 100%)",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />

              <div className="flex items-center gap-3 relative">
                <div
                  className="rounded-full flex-shrink-0"
                  style={{
                    padding: 2,
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                  }}
                >
                  <AvatarCircle user={user} size={9} />
                </div>

                <div className="min-w-0 flex-1">
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: "#ffffff", letterSpacing: "-0.01em" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: "rgba(147,197,253,0.85)" }}
                  >
                    {user.email}
                  </p>
                  <div className="mt-1.5">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ height: 1, background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)", opacity: 0.5 }} />

            <div className="py-1.5">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)] text-[var(--text-primary)]"
              >
                <UserIcon size={15} style={{ color: "var(--link-color)" }} />
                My Profile
              </Link>

              {(user.role === "writer" || user.role === "superadmin") && (
                <Link
                  href="/writer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <PenLine size={15} style={{ color: "#10b981" }} />
                  Writer Panel
                </Link>
              )}

              {user.role === "superadmin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <LayoutDashboard size={15} style={{ color: "#7c3aed" }} />
                  Admin Dashboard
                </Link>
              )}

              <div className="my-1 border-t" style={{ borderColor: "var(--border-color)" }} />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export function Header({ session }: { session: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(
    session
      ? {
          name: session.name,
          email: session.email,
          role: session.role,
          avatar: session.avatar || undefined,
        }
      : null
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && data.user) setUser(data.user);
      })
      .catch(() => null);
  }, []);

  useEffect(() => {
    if (session) {
      setUser({
        name: session.name,
        email: session.email,
        role: session.role,
        avatar: session.avatar || undefined,
      });
      fetch("/api/profile/me")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.success && data.user) setUser(data.user);
        })
        .catch(() => null);
    } else {
      setUser(null);
    }
  }, [session]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  }

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled
          ? "color-mix(in srgb, var(--bg-base) 92%, transparent)"
          : "var(--bg-base)",
        borderBottom: `1px solid ${isScrolled ? "var(--border-color)" : "transparent"}`,
        backdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(16px) saturate(180%)" : "none",
        boxShadow: isScrolled ? "0 4px 20px -2px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {}
          <Logo />

          {}
          <nav
            className="hidden lg:flex items-center gap-1.5 h-full"
            aria-label="Main navigation"
          >
            {}
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
            >
              Home
            </Link>

            {NAVIGATION_ITEMS.map((section) => (
              <div
                key={section.label}
                className="group relative h-full flex items-center"
              >
                <button
                  className="flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-200 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
                  aria-expanded="false"
                  aria-haspopup="true"
                >
                  {section.label}
                  <ChevronDown
                    size={13}
                    className="transition-transform duration-250 group-hover:rotate-180 group-focus-within:rotate-180"
                  />
                </button>

                {}
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[560px] opacity-0 translate-y-3 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto transition-all duration-250 z-50 p-5 rounded-2xl shadow-2xl border"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                    boxShadow: "var(--shadow-elevated)",
                  }}
                >
                  {}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl"
                    style={{ background: section.color }}
                  />

                  {}
                  <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-[var(--border-color)]">
                    <span style={{ color: section.color }}>{section.icon}</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                      {section.label}
                    </span>
                  </div>

                  {}
                  <div className="grid grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                    {section.items.map((item) => (
                      <Link
                        key={item.slug}
                        href={item.href || `/${section.slug}/${item.slug}`}
                        className="flex flex-col p-3 rounded-xl border border-transparent hover:border-[var(--border-color)] transition-all hover:bg-[var(--bg-base)] group/item focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
                      >
                        <span
                          className="text-xs font-bold text-[var(--text-primary)] group-hover/item:text-[var(--link-color)] transition-colors flex items-center gap-1.5"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: section.color }}
                          />
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[var(--text-tertiary)] mt-1.5 leading-normal font-medium">
                          {item.desc}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-48 lg:w-56">
              <SearchBar compact />
            </div>
            <ThemeToggle />

            {user ? (
              <UserProfileButton user={user} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
                >
                  Sign in
                </Link>
              </div>
            )}

            {}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--link-color)]"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {}
        {isMenuOpen && (
          <div
            className="lg:hidden border-t py-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="pb-3 px-1 sm:hidden">
              <SearchBar compact />
            </div>

            {}
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
            >
              Home
            </Link>

            {NAVIGATION_ITEMS.map((section) => {
              const isSectionOpen = openMobileSection === section.slug;
              return (
                <div key={section.slug} className="border-b border-[var(--border-color)] last:border-0 pb-1">
                  <button
                    onClick={() => setOpenMobileSection(isSectionOpen ? null : section.slug)}
                    className="w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span style={{ color: section.color }}>{section.icon}</span>
                      <span>{section.label}</span>
                    </div>
                    <ChevronDown
                      size={15}
                      className="text-[var(--text-secondary)] transition-transform duration-200"
                      style={{ transform: isSectionOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>

                  {isSectionOpen && (
                    <div className="pl-8 pr-3 pb-3 pt-1 space-y-1 animate-fade-in">
                      {section.items.map((item) => (
                        <Link
                          key={item.slug}
                          href={item.href || `/${section.slug}/${item.slug}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block py-2.5 px-3.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
                        >
                          {item.name}
                          <span className="block text-[10px] text-[var(--text-tertiary)] font-normal mt-1 leading-normal">
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {}
            {user ? (
              <div
                className="mt-3 pt-3 border-t space-y-2 px-1"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-[var(--bg-surface)]"
                >
                  <AvatarCircle user={user} size={9} />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-bold truncate text-[var(--text-primary)]"
                    >
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs truncate text-[var(--text-secondary)]">
                        {user.email}
                      </p>
                      <RoleBadge role={user.role} />
                    </div>
                  </div>
                </Link>

                {(user.role === "writer" || user.role === "superadmin") && (
                  <Link
                    href="/writer"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[var(--bg-surface)] text-sm font-semibold"
                    style={{ color: "#10b981" }}
                  >
                    <PenLine size={15} />
                    Writer Panel
                  </Link>
                )}

                {user.role === "superadmin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[var(--bg-surface)] text-sm font-semibold"
                    style={{ color: "#7c3aed" }}
                  >
                    <LayoutDashboard size={15} />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold text-red-500 text-left cursor-pointer"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            ) : (
              <div
                className="mt-3 pt-3 border-t px-1"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-bold text-center text-white transition-all hover:opacity-95"
                  style={{ background: "var(--link-color)" }}
                >
                  Sign in
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}