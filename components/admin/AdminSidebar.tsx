"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Layers,
  ExternalLink,
  LogOut,
  Users,
  ClipboardList,
  Menu,
  MessageSquare,
  Heart,
} from "lucide-react";
import { useState } from "react";

const ADMIN_NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin/articles", icon: BookOpen, label: "Articles", exact: false },
  { href: "/admin/articles/new", icon: PlusCircle, label: "New", exact: true },
  { href: "/admin/categories", icon: Layers, label: "Categories", exact: false },
  { href: "/admin/applications", icon: ClipboardList, label: "Applications", exact: false },
  { href: "/admin/users", icon: Users, label: "Users", exact: false },
  { href: "/admin/feedback", icon: MessageSquare, label: "Feedback", exact: false },
  { href: "/admin/donors", icon: Heart, label: "Donors", exact: false },
];

// Bottom tab bar shows only 5 items max; overflow goes into a "More" sheet
const BOTTOM_NAV = ADMIN_NAV.slice(0, 5);

export function AdminSidebar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <>
      {/* ─── Desktop sidebar ─── */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0"
        style={{
          background: "var(--bg-surface)",
          borderRight: "1px solid var(--border-color)",
          minHeight: "100vh",
        }}
      >
        {/* Logo / brand header */}
        <div className="px-5 pt-6 pb-5 border-b border-[var(--border-color)]">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/images/logo.png"
              alt="LearnoBoy"
              width={36}
              height={36}
              priority
              className="object-contain"
            />
            <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src="/images/logo-gif.gif"
                alt=""
                width={32}
                height={32}
                unoptimized
                priority
                className="w-full h-full object-contain"
              />
            </div>
          </Link>
          <p className="text-[10px] text-[var(--text-tertiary)] font-medium uppercase tracking-wider mt-2 pl-0.5">
            Admin Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
          <p className="px-2 mb-2 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
            Content
          </p>
          {ADMIN_NAV.map(({ href, icon: Icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
                        color: "var(--link-color)",
                        boxShadow: "inset 0 0 0 1px rgba(37,99,235,0.15)",
                      }
                    : {
                        color: "var(--text-secondary)",
                      }
                }
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={
                    active
                      ? { background: "var(--link-color)", boxShadow: "0 2px 6px rgba(37,99,235,0.35)" }
                      : { background: "var(--bg-muted)" }
                  }
                >
                  <Icon size={14} className={active ? "text-white" : "text-[var(--text-tertiary)]"} />
                </span>
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--link-color)" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all duration-200"
          >
            <ExternalLink size={13} />
            View public site
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
          >
            <LogOut size={13} />
            Sign out
          </button>
          <div
            className="px-3 py-2.5 rounded-xl text-xs"
            style={{ background: "var(--bg-muted)" }}
          >
            <p className="font-medium text-[var(--text-primary)] text-xs">Quick tip</p>
            <p className="text-[var(--text-tertiary)] mt-0.5 leading-relaxed">
              Use <kbd className="px-1 py-0.5 rounded bg-[var(--border-color)] font-mono text-[10px]">Ctrl+S</kbd> shortcut to save drafts quickly.
            </p>
          </div>
        </div>
      </aside>

      {/* ─── Mobile top header ─── */}
      <div
        className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)] sticky top-0 z-30"
        style={{ background: "var(--bg-surface)" }}
      >
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/images/logo-gif.gif"
            alt="LearnoBoy"
            width={26}
            height={26}
            unoptimized
            className="object-contain"
          />
          <span className="text-sm font-bold text-[var(--text-primary)]">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <ExternalLink size={16} />
          </Link>
          <button
            onClick={() => setMoreOpen(true)}
            className="p-2 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* ─── Mobile bottom tab bar ─── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t border-[var(--border-color)]"
        style={{
          background: "var(--bg-surface)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {BOTTOM_NAV.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200 relative"
              style={{ color: active ? "var(--link-color)" : "var(--text-tertiary)" }}
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ background: "var(--link-color)" }}
                />
              )}
              <Icon size={18} strokeWidth={active ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
        {/* More button for Users (6th item) */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all duration-200"
          style={{
            color: isActive("/admin/users", false) ? "var(--link-color)" : "var(--text-tertiary)",
          }}
        >
          <Users size={18} strokeWidth={isActive("/admin/users", false) ? 2.5 : 1.75} />
          <span className="text-[10px] font-medium">Users</span>
        </button>
      </nav>

      {/* ─── Mobile More sheet / overlay ─── */}
      {moreOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t border-[var(--border-color)] p-5 space-y-2"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Admin Menu</p>
              <button
                onClick={() => setMoreOpen(false)}
                className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)]"
              >
                Close
              </button>
            </div>
            {ADMIN_NAV.map(({ href, icon: Icon, label, exact }) => {
              const active = isActive(href, exact);
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={
                    active
                      ? {
                          background: "linear-gradient(135deg, rgba(37,99,235,0.12), rgba(124,58,237,0.08))",
                          color: "var(--link-color)",
                        }
                      : { color: "var(--text-secondary)" }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={
                      active
                        ? { background: "var(--link-color)" }
                        : { background: "var(--bg-muted)" }
                    }
                  >
                    <Icon size={15} className={active ? "text-white" : "text-[var(--text-tertiary)]"} />
                  </span>
                  {label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-[var(--border-color)] space-y-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
              >
                <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-950/20">
                  <LogOut size={15} className="text-red-500" />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
