"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PlusCircle,
  User,
  ExternalLink,
  LogOut,
} from "lucide-react";

const WRITER_NAV = [
  { href: "/writer", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/writer/articles", icon: BookOpen, label: "My Articles", exact: false },
  { href: "/writer/articles/new", icon: PlusCircle, label: "New Article", exact: true },
  { href: "/writer/profile", icon: User, label: "Author Profile", exact: false },
];

export function WriterSidebar() {
  const pathname = usePathname();

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
            Writer Panel
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Writer navigation">
          <p className="px-2 mb-2 text-[10px] font-semibold text-[var(--text-tertiary)] uppercase tracking-widest">
            Content
          </p>
          {WRITER_NAV.map(({ href, icon: Icon, label, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(16,185,129,0.12), rgba(5,150,105,0.08))",
                        color: "#059669",
                        boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.2)",
                      }
                    : { color: "var(--text-secondary)" }
                }
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={
                    active
                      ? { background: "#059669", boxShadow: "0 2px 6px rgba(16,185,129,0.35)" }
                      : { background: "var(--bg-muted)" }
                  }
                >
                  <Icon size={14} className={active ? "text-white" : "text-[var(--text-tertiary)]"} />
                </span>
                {label}
                {active && (
                  <span
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: "#059669" }}
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
            <p className="font-medium text-[var(--text-primary)] text-xs">Writer tip</p>
            <p className="text-[var(--text-tertiary)] mt-0.5 leading-relaxed">
              Use <kbd className="px-1 py-0.5 rounded bg-[var(--border-color)] font-mono text-[10px]">Ctrl+S</kbd> to save drafts quickly.
            </p>
          </div>
        </div>
      </aside>

      {/* ─── Mobile top nav ─── */}
      <div
        className="md:hidden flex items-center gap-1 px-3 py-2.5 border-b border-[var(--border-color)] overflow-x-auto"
        style={{ background: "var(--bg-surface)" }}
      >
        <div className="flex items-center gap-2 pr-3 border-r border-[var(--border-color)] mr-1 flex-shrink-0">
          <div className="w-6 h-6 flex items-center justify-center overflow-hidden flex-shrink-0">
            <Image
              src="/images/logo-gif.gif"
              alt="LearnoBoy"
              width={22}
              height={22}
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xs font-bold text-[var(--text-primary)]">Writer</span>
        </div>

        {WRITER_NAV.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0"
              style={
                active
                  ? { background: "#059669", color: "#fff" }
                  : { color: "var(--text-secondary)" }
              }
            >
              <Icon size={12} />
              {label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200 flex-shrink-0"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </>
  );
}
