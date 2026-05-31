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
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "@/components/search/SearchBar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/javascript", label: "JavaScript" },
  { href: "/python", label: "Python" },
  { href: "/web-development", label: "Web Dev" },
  { href: "/data-structures", label: "DSA" },
];

// ── Types ──────────────────────────────────────────────────────────────────
interface UserInfo {
  name: string;
  email: string;
  role: "reader" | "writer" | "superadmin";
  avatar?: string;
}

// ── Logo + Wordmark ────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 flex-shrink-0 group"
      aria-label="LearnoBoy home"
    >
      {/* Logo image — always visible */}
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

      {/* Wordmark — hidden on mobile, visible on sm+ */}
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

// ── Avatar circle ──────────────────────────────────────────────────────────
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

// ── Role badge ─────────────────────────────────────────────────────────────
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

// ── Desktop profile dropdown ───────────────────────────────────────────────
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
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 hover:bg-[var(--bg-surface)] group"
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
            {/* User card header — deep navy blue matching logo */}
            <div
              className="px-4 py-4 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #0f1e4a 0%, #1a3070 60%, #1e3a8a 100%)",
              }}
            >
              {/* Subtle radial glow top-right */}
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
                {/* Avatar with ring */}
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

            {/* Thin accent line */}
            <div style={{ height: 1, background: "linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)", opacity: 0.5 }} />

            <div className="py-1.5">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)]"
                style={{ color: "var(--text-primary)" }}
              >
                <UserIcon size={15} style={{ color: "var(--link-color)" }} />
                My Profile
              </Link>

              {(user.role === "writer" || user.role === "superadmin") && (
                <Link
                  href="/writer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <PenLine size={15} style={{ color: "#059669" }} />
                  Writer Panel
                </Link>
              )}

              {user.role === "superadmin" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-[var(--bg-base)]"
                  style={{ color: "var(--text-primary)" }}
                >
                  <LayoutDashboard size={15} style={{ color: "#7c3aed" }} />
                  Admin Dashboard
                </Link>
              )}

              <div className="my-1 border-t" style={{ borderColor: "var(--border-color)" }} />

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left font-medium"
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

// ── Main Header ────────────────────────────────────────────────────────────
export function Header({ session }: { session: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
        boxShadow: isScrolled ? "0 1px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo + Wordmark */}
          <Logo />

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center gap-0.5"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <div className="hidden sm:block w-52">
              <SearchBar compact />
            </div>
            <ThemeToggle />

            {user ? (
              <UserProfileButton user={user} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-surface)]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Sign in
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className="md:hidden border-t py-3 space-y-1"
            style={{ borderColor: "var(--border-color)" }}
          >
            <div className="pb-3">
              <SearchBar compact />
            </div>

            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-all"
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile user section */}
            {user ? (
              <div
                className="mt-2 pt-2 border-t space-y-1"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[var(--bg-surface)]"
                >
                  <AvatarCircle user={user} size={9} />
                  <div className="min-w-0 flex-1">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {user.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
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
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-[var(--bg-surface)] text-sm font-medium"
                    style={{ color: "#059669" }}
                  >
                    <PenLine size={15} />
                    Writer Panel
                  </Link>
                )}

                {user.role === "superadmin" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-[var(--bg-surface)] text-sm font-medium"
                    style={{ color: "#7c3aed" }}
                  >
                    <LayoutDashboard size={15} />
                    Admin Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-red-50 dark:hover:bg-red-950/20 text-sm font-semibold text-red-500 text-left"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            ) : (
              <div
                className="mt-2 pt-2 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] transition-all"
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