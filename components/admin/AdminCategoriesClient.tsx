"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Layers, Pencil, Trash2 } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { AddCategoryModal } from "@/components/admin/AddCategoryModal";
import type { ICategory } from "@/types";

interface Props {
  initialCategories: ICategory[];
}

export function AdminCategoriesClient({ initialCategories }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>(initialCategories);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  /** Refresh list from server after a new category is created */
  const handleCategoryAdded = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch {
      // fallback: trigger Next.js server re-render
      router.refresh();
    }
  }, [router]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={20} style={{ color: "var(--link-color)" }} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Categories
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {categories.length}{" "}
            {categories.length === 1 ? "category" : "categories"} · organise
            your content
          </p>
        </div>

        {/* Add Category button */}
        <AddCategoryModal onSuccess={handleCategoryAdded} />
      </div>

      {/* ── Category grid ── */}
      {categories.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-24 rounded-2xl border border-dashed border-[var(--border-color)] text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: "rgba(37,99,235,0.08)" }}
          >
            <Layers size={24} style={{ color: "var(--link-color)" }} />
          </div>
          <p className="font-semibold text-[var(--text-primary)] mb-1">
            No categories yet
          </p>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-xs">
            Create your first category to organise articles by topic.
          </p>
          <AddCategoryModal onSuccess={handleCategoryAdded} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] transition-all duration-200 hover:shadow-md"
              style={{ background: "var(--bg-surface)" }}
            >
              {/* Color accent stripe */}
              <div
                className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full"
                style={{ background: cat.color }}
              />

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${cat.color}18` }}
              >
                <CategoryIcon
                  icon={cat.icon}
                  className="w-6 h-6"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-[var(--text-primary)] truncate leading-snug">
                  {cat.name}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5 truncate">
                  /{cat.slug} · {cat.articleCount}{" "}
                  {cat.articleCount === 1 ? "article" : "articles"}
                </p>
                {cat.description && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                )}
              </div>

              {/* Color dot + actions */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: cat.color }}
                  title={cat.color}
                />
                <button
                  onClick={() => handleDelete(cat._id, cat.name)}
                  disabled={deletingId === cat._id}
                  className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-150 disabled:opacity-30"
                  aria-label={`Delete ${cat.name}`}
                  title="Delete category"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
