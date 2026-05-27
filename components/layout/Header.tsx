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

// ── Helper: initials from name ─────────────────────────────────────────────
function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Avatar circle (shared between desktop & mobile) ────────────────────────
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

  const px = size * 4; // Tailwind w-8 → 32px, w-9 → 36px

  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 shadow-sm overflow-hidden`}
      style={{ background: gradientByRole[user.role], width: `${px}px`, height: `${px}px` }}
    >
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        getInitials(user.name)
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

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            className="absolute right-0 mt-2 w-56 rounded-2xl shadow-xl z-50 overflow-hidden"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            }}
          >
            {/* User info header */}
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--border-color)" }}>
              <div className="flex items-center gap-3">
                <AvatarCircle user={user} size={9} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                    {user.name}
                  </p>
                  <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {user.email}
                  </p>
                  <div className="mt-1">
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              </div>
            </div>

            {/* Menu items */}
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

              {/* Writer panel — for writers and superadmins */}
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

              {/* Admin panel — superadmin only */}
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

  // Fetch current user info from session
  useEffect(() => {
    fetch("/api/profile/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.success && data.user) {
          setUser(data.user);
        }
      })
      .catch(() => null);
  }, []);

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
          ? "color-mix(in srgb, var(--bg-base) 95%, transparent)"
          : "var(--bg-base)",
        borderBottom: `1px solid var(--border-color)`,
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0"
            aria-label="LearnoBoy home"
          >
            <div
              className="flex items-center justify-center"
              style={{ height: "120px" }}
            >
              <Image
                src="/images/logo.png"
                alt="LearnoBoy"
                width={200}
                height={200}
                unoptimized
                loading="eager"
                fetchPriority="high"
                style={{ height: "100%", width: "auto", objectFit: "contain", borderRadius: "30%" }}
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5" aria-label="Main navigation">
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
          <div className="flex items-center gap-2">
            <div className="hidden sm:block w-56">
              <SearchBar compact />
            </div>
            <ThemeToggle />

            {/* Profile button — only show when logged in */}
            {user ? (
              <UserProfileButton user={user} />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-[var(--bg-surface)]"
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
          <div className="md:hidden border-t border-[var(--border-color)] py-3 space-y-1 animate-fade-in">
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
              <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: "var(--border-color)" }}>
                {/* User info row */}
                <Link
                  href="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all hover:bg-[var(--bg-surface)]"
                >
                  <AvatarCircle user={user} size={9} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
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

                {/* Writer panel */}
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

                {/* Admin panel */}
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
              <div className="mt-2 pt-2 border-t" style={{ borderColor: "var(--border-color)" }}>
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