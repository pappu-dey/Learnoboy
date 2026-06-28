"use client";

import { useState, useTransition, useEffect } from "react";
import { Plus, X, Check, Loader2, Layers, Tag } from "lucide-react";
import type { ICategory } from "@/types";

interface AddCategoryModalProps {
  onSuccess: () => void;
  defaultParentId?: string;
  trigger?: React.ReactNode;
}

const PRESET_COLORS = [
  "#f59e0b", "#10b981", "#8b5cf6", "#2563eb",
  "#ef4444", "#14b8a6", "#ec4899", "#f97316",
  "#6366f1", "#06b6d4",
];

export function AddCategoryModal({ onSuccess, defaultParentId, trigger }: AddCategoryModalProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);

  
  const [type, setType] = useState<"top" | "sub">(defaultParentId ? "sub" : "top");
  const [parentId, setParentId] = useState(defaultParentId || "");
  const [parentCategories, setParentCategories] = useState<ICategory[]>([]);

  
  useEffect(() => {
    if (open) {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((json) => {
          if (json.success && Array.isArray(json.data)) {
            setParentCategories(json.data);
          }
        })
        .catch((err) => console.error("Error fetching parent categories:", err));
    }
  }, [open]);

  
  useEffect(() => {
    if (defaultParentId) {
      setType("sub");
      setParentId(defaultParentId);
    }
  }, [defaultParentId]);

  
  useEffect(() => {
    if (type === "sub" && parentId && parentCategories.length > 0) {
      const parent = parentCategories.find((c) => c._id === parentId);
      if (parent) {
        setColor(parent.color);
      }
    }
  }, [parentId, type, parentCategories]);

  
  function handleNameChange(value: string) {
    setName(value);
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    );
  }

  function reset() {
    setName("");
    setSlug("");
    setDescription("");
    setColor(PRESET_COLORS[0]);
    setType(defaultParentId ? "sub" : "top");
    setParentId(defaultParentId || "");
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    setOpen(false);
    setTimeout(reset, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    if (type === "sub" && !parentId) {
      setError("Please select a parent category.");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const payload = {
          name: name.trim(),
          slug,
          description,
          color,
          parent: type === "sub" ? parentId : null,
        };

        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();

        if (!res.ok) {
          setError(json.error ?? "Failed to create category.");
          return;
        }

        setSuccess(true);
        setTimeout(() => {
          handleClose();
          onSuccess();
        }, 800);
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  return (
    <>
      {}
      {trigger ? (
        <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
          {trigger}
        </div>
      ) : (
        <button
          id="add-category-btn"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            background: "var(--link-color)",
            color: "#ffffff",
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Category
        </button>
      )}

      {}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          {}
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden"
            style={{ background: "var(--bg-base)" }}
          >
            {}
            <div
              className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]"
              style={{ background: "var(--bg-surface)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${color}22` }}
                >
                  {type === "top" ? (
                    <Layers size={16} style={{ color }} />
                  ) : (
                    <Tag size={16} style={{ color }} />
                  )}
                </div>
                <h2 className="font-bold text-[var(--text-primary)]">
                  {type === "top" ? "New Category" : "New Subcategory"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-muted)]"
                aria-label="Close"
              >
                <X size={16} className="text-[var(--text-tertiary)]" />
              </button>
            </div>

            {}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              {}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[var(--text-primary)]">
                  Category Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setType("top");
                      setParentId("");
                    }}
                    className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all duration-200 ${
                      type === "top"
                        ? "border-[var(--link-color)] bg-[rgba(37,99,235,0.06)] text-[var(--link-color)]"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                    }`}
                  >
                    Top-level Category
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("sub")}
                    className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all duration-200 ${
                      type === "sub"
                        ? "border-[var(--link-color)] bg-[rgba(37,99,235,0.06)] text-[var(--link-color)]"
                        : "border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)]"
                    }`}
                  >
                    Subcategory
                  </button>
                </div>
              </div>

              {}
              {type === "sub" && (
                <div className="space-y-1.5 animate-fadeIn">
                  <label
                    htmlFor="parent-cat"
                    className="text-sm font-medium text-[var(--text-primary)]"
                  >
                    Parent Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="parent-cat"
                    value={parentId}
                    onChange={(e) => setParentId(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:ring-2 transition-shadow"
                    style={{ focusRingColor: color } as React.CSSProperties}
                  >
                    <option value="" disabled>
                      Select a parent category...
                    </option>
                    {parentCategories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {}
              <div className="space-y-1.5">
                <label
                  htmlFor="cat-name"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="cat-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={type === "top" ? "e.g. Machine Learning" : "e.g. NumPy"}
                  required
                  className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 transition-shadow"
                  style={{ focusRingColor: color } as React.CSSProperties}
                />
              </div>

              {}
              <div className="space-y-1.5">
                <label
                  htmlFor="cat-slug"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Slug
                </label>
                <input
                  id="cat-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-tertiary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 transition-shadow font-mono"
                />
                <p className="text-xs text-[var(--text-tertiary)]">
                  URL: /{slug || "category-slug"}
                </p>
              </div>

              {}
              <div className="space-y-1.5">
                <label
                  htmlFor="cat-desc"
                  className="text-sm font-medium text-[var(--text-primary)]"
                >
                  Description
                </label>
                <textarea
                  id="cat-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={
                    type === "top"
                      ? "Short description of this category…"
                      : `Topics or details within this subcategory…`
                  }
                  rows={2}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:ring-2 transition-shadow resize-none"
                />
              </div>

              {}
              {type === "top" ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--text-primary)]">
                    Accent Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-7 h-7 rounded-full border-2 transition-transform duration-150 hover:scale-110 flex items-center justify-center"
                        style={{
                          background: c,
                          borderColor: color === c ? "#fff" : "transparent",
                          boxShadow: color === c ? `0 0 0 2px ${c}` : "none",
                        }}
                        aria-label={`Select color ${c}`}
                      >
                        {color === c && (
                          <Check size={11} color="#fff" strokeWidth={3} />
                        )}
                      </button>
                    ))}
                    {}
                    <label
                      className="w-7 h-7 rounded-full border-2 border-dashed border-[var(--border-color)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform overflow-hidden"
                      title="Custom color"
                    >
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="opacity-0 absolute w-1 h-1"
                      />
                      <span className="text-[10px] text-[var(--text-tertiary)] font-bold">+</span>
                    </label>
                  </div>
                </div>
              ) : (
                type === "sub" && parentId && (
                  <div className="space-y-1.5 text-xs text-[var(--text-secondary)] bg-[var(--bg-muted)] p-3 rounded-lg flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    Inheriting color theme from parent category.
                  </div>
                )
              )}

              {}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                style={{ background: `${color}18`, color }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ background: color }}
                />
                Preview: {name || "Name"}
              </div>

              {}
              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                  <X size={14} />
                  {error}
                </div>
              )}

              {}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending || success || !name.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:opacity-90 active:scale-95"
                  style={{
                    background: success ? "#10b981" : "var(--link-color)",
                    color: "#ffffff",
                  }}
                >
                  {isPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Creating…
                    </>
                  ) : success ? (
                    <>
                      <Check size={14} strokeWidth={2.5} />
                      Created!
                    </>
                  ) : (
                    <>
                      <Plus size={14} strokeWidth={2.5} />
                      {type === "top" ? "Create Category" : "Create Subcategory"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
