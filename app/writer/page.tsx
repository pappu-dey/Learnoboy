import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import { getArticles } from "@/lib/services/articleService";
import {
  BookOpen,
  PlusCircle,
  FileText,
  Eye,
  TrendingUp,
  ArrowRight,
  Clock,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Writer Dashboard — Learno-Boy" };

export default async function WriterDashboard() {
  const session = await getSession();
  if (!session) return null;

  await connectDB();

  
  const authorDoc = await Author.findOne({ email: session.email }).lean();
  const authorId = authorDoc ? String((authorDoc as { _id: unknown })._id) : null;

  const [publishedRes, draftRes] = await Promise.all([
    authorId
      ? getArticles({ status: "published", limit: 6, sort: "newest", authorId }).catch(() => ({ data: [], total: 0 }))
      : Promise.resolve({ data: [], total: 0 }),
    authorId
      ? getArticles({ status: "draft", limit: 6, sort: "newest", authorId }).catch(() => ({ data: [], total: 0 }))
      : Promise.resolve({ data: [], total: 0 }),
  ]);

  const stats = [
    {
      label: "Published",
      value: publishedRes.total,
      icon: BookOpen,
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "rgba(16,185,129,0.2)",
      href: "/writer/articles?status=published",
    },
    {
      label: "Drafts",
      value: draftRes.total,
      icon: FileText,
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      glow: "rgba(245,158,11,0.2)",
      href: "/writer/articles?status=draft",
    },
    {
      label: "Total Views",
      value: publishedRes.data.reduce((s, a) => s + (a.views || 0), 0),
      icon: Eye,
      gradient: "linear-gradient(135deg, #2563eb, #1d4ed8)",
      glow: "rgba(37,99,235,0.2)",
      href: "/writer/articles",
    },
    {
      label: "All Articles",
      value: publishedRes.total + draftRes.total,
      icon: TrendingUp,
      gradient: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
      glow: "rgba(139,92,246,0.2)",
      href: "/writer/articles",
    },
  ];

  return (
    <div className="space-y-8">
      {}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">
            Writer Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Welcome back, <span className="font-medium text-[var(--text-primary)]">{session.name}</span> — here&apos;s your content overview.
          </p>
        </div>
        <Link
          href="/writer/articles/new"
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 hover:-translate-y-0.5 duration-200 shadow-sm w-full sm:w-auto"
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            boxShadow: "0 4px 14px rgba(16,185,129,0.4)",
          }}
        >
          <PlusCircle size={15} />
          New Article
        </Link>
      </div>

      {}
      {!authorDoc && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{ background: "rgba(245,158,11,0.06)", borderColor: "rgba(245,158,11,0.25)" }}
        >
          <span className="text-2xl">ℹ️</span>
          <div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">Your author profile is being set up</p>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              Your Author record is created automatically. If you see this message, please ask an admin to verify your writer status. Meanwhile, complete your{" "}
              <Link href="/writer/profile" className="underline font-medium">author profile →</Link>
            </p>
          </div>
        </div>
      )}

      {}
      {authorDoc && (!authorDoc.bio || !authorDoc.avatar) && (
        <div
          className="flex items-center gap-3 p-4 rounded-2xl border"
          style={{ background: "rgba(37,99,235,0.05)", borderColor: "rgba(37,99,235,0.2)" }}
        >
          <span className="text-2xl">✨</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-[var(--link-color)]">Complete your public profile</p>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              Add a bio, photo, and social links to make your author profile shine.{" "}
              <Link href="/writer/profile" className="underline font-medium text-[var(--link-color)]">Complete profile →</Link>
            </p>
          </div>
        </div>
      )}


      {}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, gradient, glow, href }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-4 p-5 rounded-2xl border border-[var(--border-color)] transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-40 blur-xl transition-all duration-300 group-hover:opacity-70 group-hover:scale-110" style={{ background: glow }} />
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ background: gradient }}>
              <Icon size={18} className="text-white" />
            </div>
            <div className="relative">
              <p className="text-3xl font-bold text-[var(--text-primary)] tabular-nums">{value.toLocaleString()}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">{label}</p>
            </div>
            <ArrowRight size={14} className="relative ml-auto text-[var(--text-tertiary)] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-emerald-500" />
          </Link>
        ))}
      </div>

      {}
      <div className="flex flex-wrap gap-3 p-4 rounded-2xl border border-[var(--border-color)]" style={{ background: "var(--bg-surface)" }}>
        <p className="w-full text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-1">Quick Actions</p>
        {[
          { href: "/writer/articles/new", label: "✍️ Write Article", primary: true },
          { href: "/writer/articles?status=draft", label: "📝 View Drafts", primary: false },
          { href: "/writer/articles?status=published", label: "📖 Published", primary: false },
          { href: "/writer/profile", label: "👤 My Profile", primary: false },
        ].map(({ href, label, primary }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:-translate-y-0.5"
            style={
              primary
                ? { background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", boxShadow: "0 2px 8px rgba(16,185,129,0.3)" }
                : { background: "var(--bg-muted)", color: "var(--text-secondary)", border: "1px solid var(--border-color)" }
            }
          >
            {label}
          </Link>
        ))}
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {}
        <section className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#10b981" }} />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">Recent Published</h2>
            </div>
            <Link href="/writer/articles?status=published" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--link-color)" }}>
              View all <ArrowRight size={11} />
            </Link>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {publishedRes.data.length === 0 ? (
              <div className="py-12 text-center">
                <BookOpen size={28} className="mx-auto mb-2 text-[var(--text-tertiary)] opacity-50" />
                <p className="text-sm text-[var(--text-tertiary)]">No published articles yet</p>
                <Link href="/writer/articles/new" className="text-xs mt-1.5 inline-block hover:underline font-medium" style={{ color: "var(--link-color)" }}>
                  Write your first article →
                </Link>
              </div>
            ) : (
              publishedRes.data.map((article) => (
                <div key={article._id} className="flex items-start justify-between px-5 py-3.5 gap-3 hover:bg-[var(--bg-muted)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{article.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Eye size={10} />{article.views?.toLocaleString() || 0} views
                      </span>
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                          <Clock size={10} />{format(new Date(article.publishedAt), "MMM d")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/writer/articles/${article._id}/edit`}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
                  >
                    <Pencil size={10} /> Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        {}
        <section className="rounded-2xl border border-[var(--border-color)] overflow-hidden" style={{ background: "var(--bg-surface)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#f59e0b" }} />
              <h2 className="font-semibold text-sm text-[var(--text-primary)]">Drafts</h2>
            </div>
            <Link href="/writer/articles?status=draft" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--link-color)" }}>
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
              draftRes.data.map((article) => (
                <div key={article._id} className="flex items-start justify-between px-5 py-3.5 gap-3 hover:bg-[var(--bg-muted)] transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{article.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: "rgba(245,158,11,0.12)", color: "#d97706" }}>
                        Draft
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                        <Clock size={10} />{article.readingTime} min read
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/writer/articles/${article._id}/edit`}
                    className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-colors shrink-0"
                  >
                    <Pencil size={10} /> Edit
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
