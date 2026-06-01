"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Layers, Trash2, Tag, Plus, FolderPlus, BookOpen, CornerDownRight } from "lucide-react";
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

  /** Refresh list from server after a new category or subcategory is created */
  const handleCategoryAdded = useCallback(async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCategories(json.data);
      }
    } catch {
      router.refresh();
    }
  }, [router]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
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

  // Separate top-level categories and subcategories
  const { topLevelCategories, subcategoriesByParent, orphanedSubcategories } = useMemo(() => {
    const topLevels = categories.filter((cat) => !cat.parent);
    
    const subsMap: Record<string, ICategory[]> = {};
    const orphans: ICategory[] = [];

    categories.forEach((cat) => {
      if (cat.parent) {
        const parentId = typeof cat.parent === "object" ? cat.parent._id : cat.parent;
        // Verify parent exists in our list
        const parentExists = categories.some((c) => c._id === parentId);
        if (parentExists) {
          if (!subsMap[parentId]) subsMap[parentId] = [];
          subsMap[parentId].push(cat);
        } else {
          orphans.push(cat);
        }
      }
    });

    return {
      topLevelCategories: topLevels,
      subcategoriesByParent: subsMap,
      orphanedSubcategories: orphans,
    };
  }, [categories]);

  const totalSubcategories = categories.length - topLevelCategories.length;

  return (
    <div>
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers size={22} style={{ color: "var(--link-color)" }} />
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Categories & Subcategories
            </h1>
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            {topLevelCategories.length} parent categories · {totalSubcategories} subcategories
          </p>
        </div>

        {/* Global Add Category Modal */}
        <div className="flex gap-2.5">
          <AddCategoryModal onSuccess={handleCategoryAdded} />
        </div>
      </div>

      {/* ── Main content layout ── */}
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
            Create your first category or subcategory to organize articles by topic.
          </p>
          <AddCategoryModal onSuccess={handleCategoryAdded} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grouped parent category rows */}
          <div className="grid grid-cols-1 gap-6">
            {topLevelCategories.map((parent) => {
              const subs = subcategoriesByParent[parent._id] || [];
              return (
                <div
                  key={parent._id}
                  className="group relative rounded-2xl border border-[var(--border-color)] transition-all duration-300 hover:shadow-lg overflow-hidden flex flex-col"
                  style={{ background: "var(--bg-surface)" }}
                >
                  {/* Parent accent colored top-bar */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: parent.color }}
                  />

                  <div className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-6">
                    {/* Parent Left Section (Icon & Info) */}
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                        style={{ background: `${parent.color}15`, border: `1px solid ${parent.color}25`, color: parent.color }}
                      >
                        <CategoryIcon icon={parent.icon} className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="font-bold text-lg text-[var(--text-primary)]">
                            {parent.name}
                          </h2>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
                            style={{ background: `${parent.color}18`, color: parent.color }}
                          >
                            /{parent.slug}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] max-w-xl">
                          {parent.description || "No description provided."}
                        </p>
                      </div>
                    </div>

                    {/* Parent Right Section (Stats & Actions) */}
                    <div className="flex items-center gap-4 self-end md:self-start flex-shrink-0">
                      <div className="text-right">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] bg-[var(--bg-muted)] px-2.5 py-1 rounded-full font-medium">
                          <BookOpen size={12} />
                          {parent.articleCount} {parent.articleCount === 1 ? "article" : "articles"}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {/* Delete Parent Category */}
                        <button
                          onClick={() => handleDelete(parent._id, parent.name)}
                          disabled={deletingId === parent._id || subs.length > 0}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                          title={subs.length > 0 ? "Delete subcategories first" : "Delete category"}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nested Subcategories section */}
                  <div
                    className="border-t border-[var(--border-color)] px-6 py-4 flex flex-col gap-3"
                    style={{ background: "rgba(0,0,0,0.015)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
                        <Tag size={12} />
                        <span>Subcategories ({subs.length})</span>
                      </div>
                      
                      {/* Inline Add Subcategory button */}
                      <AddCategoryModal
                        onSuccess={handleCategoryAdded}
                        defaultParentId={parent._id}
                        trigger={
                          <button className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold text-[var(--link-color)] hover:bg-[rgba(37,99,235,0.08)] transition-all active:scale-95 border border-[rgba(37,99,235,0.15)] bg-white dark:bg-[var(--bg-surface)]">
                            <Plus size={12} strokeWidth={2.5} />
                            Add Subcategory
                          </button>
                        }
                      />
                    </div>

                    {subs.length === 0 ? (
                      <p className="text-xs text-[var(--text-tertiary)] italic py-1">
                        No subcategories. Click 'Add Subcategory' to create one.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {subs.map((sub) => (
                          <div
                            key={sub._id}
                            className="group/sub flex items-center justify-between gap-3 p-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] transition-all duration-200 hover:border-[var(--link-color)] hover:shadow-sm"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <CornerDownRight size={14} className="text-[var(--text-tertiary)] flex-shrink-0" />
                              <div className="min-w-0">
                                <span className="font-semibold text-sm text-[var(--text-primary)] truncate block">
                                  {sub.name}
                                </span>
                                <span className="text-[10px] text-[var(--text-tertiary)] truncate block">
                                  /{sub.slug} · {sub.articleCount} articles
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDelete(sub._id, sub.name)}
                              disabled={deletingId === sub._id}
                              className="opacity-0 group-hover/sub:opacity-100 w-7 h-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all disabled:opacity-20"
                              title="Delete subcategory"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Orphaned subcategories (if any exist) */}
          {orphanedSubcategories.length > 0 && (
            <div className="mt-8 p-6 rounded-2xl border border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/30 dark:bg-yellow-900/5">
              <h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-400 uppercase tracking-wider mb-3">
                ⚠️ Orphaned Subcategories ({orphanedSubcategories.length})
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                These subcategories have a parent set in the database, but the parent category could not be found. 
                You can delete them or recreate their parent categories.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {orphanedSubcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-yellow-200 dark:border-yellow-900/30 bg-[var(--bg-surface)]"
                  >
                    <div className="min-w-0">
                      <span className="font-semibold text-sm text-[var(--text-primary)] block truncate">
                        {sub.name}
                      </span>
                      <span className="text-[10px] text-[var(--text-tertiary)] block">
                        Parent ID: {typeof sub.parent === "object" ? sub.parent?._id : sub.parent}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDelete(sub._id, sub.name)}
                      disabled={deletingId === sub._id}
                      className="w-7 h-7 flex items-center justify-center rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
