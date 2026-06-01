import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";
import {
  BookOpen,
  PlusCircle,
  FileText,
  Eye,
  Layers,
  TrendingUp,
  ArrowRight,
  Clock,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export const metadata: Metadata = { title: "Admin Dashboard — Learno-Boy" };

export default async function AdminDashboard() {
  const [publishedRes, draftRes, categories] = await Promise.all([
    getArticles({ status: "published", limit: 6, sort: "newest" }).catch(() => ({
      data: [],
      total: 0,
    })),
    getArticles({ status: "draft", limit: 6, sort: "newest" }).catch(() => ({
      data: [],
      total: 0,
    })),
    getAllCategories().catch(() => []),
  ]);

  const stats = [
    {
      label: "Published",
      value: publishedRes.total,
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "rgba(16,185,129,0.2)",
      href: "/admin/articles?status=published",
    },
    {
      label: "Drafts",
      value: draftRes.total,
      icon: FileText,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      glow: "rgba(245,158,11,0.2)",
      href: "/admin/articles?status=draft",
    },
    {
      label: "Categories",
      value: categories.length,
      icon: Layers,
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      glow: "rgba(139,92,246,0.2)",
      href: "/admin/categories",
    },
    {
      label: "Total Articles",
      value: publishedRes.total + draftRes.total,
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      glow: "rgba(37,99,235,0.2)",
      href: "/admin/articles",
    },
  ];

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Welcome back — here&apos;s what&apos;s happening with your content.
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 duration-200 shadow-sm w-full sm:w-auto"
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
          }}
        >
          <PlusCircle size={15} />
          New Article
        </Link>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, glow, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-4 p-5 rounded-2xl border border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            style={{ background: "var(--bg-surface)" }}
          >
            {/* Glow blob in background */}
            <div
              className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-40 blur-xl transition-all duration-300 group-hover:opacity-70 group-hover:scale-110"
              style={{ background: glow }}
            />
            <div
              className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ background: gradient }}
            >
              <Icon size={18} className="text-white" />
            </div>
            <div className="relative">
              <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                {value}
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
                {label}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="relative ml-auto text-[var(--text-tertiary)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--link-color)]"
            />
          </Link>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div
        className="flex flex-wrap gap-3 p-4 rounded-2xl border border-[var(--border-color)]"
        style={{ background: "var(--bg-surface)" }}
      >
        <p className="w-full text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">
          Quick Actions
        </p>
        {[
          { href: "/admin/articles/new", label: "✍️ Write Article", primary: true },
          { href: "/admin/articles?status=draft", label: "📝 View Drafts", primary: false },
          { href: "/admin/categories", label: "🗂️ Manage Categories", primary: false },
          { href: "/admin/articles?status=published", label: "📖 Published Articles", primary: false },
        ].map(({ href, label, primary }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={
              primary
                ? {
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "#fff",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                  }
                : {
                    background: "var(--bg-muted)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                  }
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {/* ── Recent articles ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Published */}
        <section
          className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#10b981" }}
              />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Recent Published
              </h2>
            </div>
            <Link
              href="/admin/articles?status=published"
              className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "var(--link-color)" }}
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {publishedRes.data.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen size={28} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-50" />
                <p className="text-sm text-[var(--text-tertiary)]">No published articles yet</p>
                <Link
                  href="/admin/articles/new"
                  className="text-xs mt-1.5 inline-block hover:underline font-medium"
                  style={{ color: "var(--link-color)" }}
                >
                  Write your first article →
                </Link>
              </div>
            ) : (
              publishedRes.data.slice(0, 6).map((article) => (
                <div
                  key={article._id}
                  className="flex items-start justify-between px-5 py-3.5 gap-3 hover:bg-[var(--bg-muted)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Eye size={10} />
                        {article.views.toLocaleString()} views
                      </span>
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                          <Clock size={10} />
                          {format(new Date(article.publishedAt), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/admin/articles/${article._id}/edit`}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
                  >
                    <Pencil size={10} />
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Drafts */}
        <section
          className="rounded-2xl border border-[var(--border-color)] overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "#f59e0b" }}
              />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">
                Drafts
              </h2>
            </div>
            <Link
              href="/admin/articles?status=draft"
              className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "var(--link-color)" }}
            >
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {draftRes.data.length === 0 ? (
              <div className="py-12 text-center">
                <FileText size={28} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-50" />
                <p className="text-sm text-[var(--text-tertiary)]">No drafts</p>
              </div>
            ) : (
              draftRes.data.slice(0, 6).map((article) => (
                <div
                  key={article._id}
                  className="flex items-start justify-between px-5 py-3.5 gap-3 hover:bg-[var(--bg-muted)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                      {article.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider"
                        style={{
                          background: "rgba(245,158,11,0.12)",
                          color: "#d97706",
                        }}
                      >
                        Draft
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Clock size={10} />
                        {article.readingTime} min read
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/articles/${article._id}/edit`}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
                  >
                    <Pencil size={10} />
                    Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* ── Categories overview ── */}
      {categories.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm text-[var(--text-primary)]">
              Categories
            </h2>
            <Link
              href="/admin/categories"
              className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "var(--link-color)" }}
            >
              Manage <ArrowRight size={11} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <span
                key={cat._id}
                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border"
                style={{
                  background: `${cat.color}12`,
                  color: cat.color,
                  borderColor: `${cat.color}30`,
                }}
              >
                <CategoryIcon icon={cat.icon} className="w-3.5 h-3.5" />
                {cat.name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
