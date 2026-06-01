"use client";

import { useState, useCallback, useRef, useEffect, DragEvent, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { slugify } from "@/lib/utils/slugify";
import type { ICategory, IAuthor, ITag } from "@/types";
import {
  Image as ImageIcon,
  Loader2,
  Copy,
  Check,
  CornerDownRight,
  X,
  Move,
  AlertCircle,
  RefreshCw,
  Pencil,
  Search,
  ChevronDown,
  FolderOpen,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code2,
  Code,
  Link2,
  Quote,
  List,
  ListOrdered,
  Minus,
  Undo2,
  Redo2,
} from "lucide-react";

/* ─── Constants ───────────────────────────────────────────── */

const ACCEPTED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_HISTORY = 200;

const CATEGORY_MAP: Record<string, { name: string; subcategories: string[] }> = {
  coding: {
    name: "Coding",
    subcategories: ["C", "C++", "Java", "Python", "JavaScript"]
  },
  dsa: {
    name: "DSA",
    subcategories: [
      "Arrays", "Linked List", "Stack", "Queue", "Tree", "Graph", 
      "Heap", "Dynamic Programming", "Greedy", "Two Pointers", 
      "Sliding Window", "Recursion"
    ]
  },
  "web-development": {
    name: "Web Development",
    subcategories: ["HTML", "CSS", "JavaScript", "React", "Next.js", "Node.js", "Express.js"]
  },
  database: {
    name: "Database",
    subcategories: ["SQL", "MySQL", "MongoDB", "PostgreSQL", "DBMS"]
  },
  "cs-fundamentals": {
    name: "CS Fundamentals",
    subcategories: ["Operating Systems", "Computer Networks", "Software Engineering", "Cyber Law", "Professional Ethics"]
  },
  "machine-learning": {
    name: "Machine Learning",
    subcategories: ["General ML", "Supervised Learning", "Unsupervised Learning", "Deep Learning"]
  },
  "cyber-security": {
    name: "Cyber Security",
    subcategories: ["Network Security", "Cryptography", "Penetration Testing", "Cyber Defense"]
  }
};

/* ─── Types ─────────────────────────────────────────────── */

type UploadStatus = "uploading" | "done" | "error";

interface UploadedImage {
  id: string;
  url: string;
  alt: string;
  markdown: string;
  justInserted: boolean;
  status: UploadStatus;
  errorMsg?: string;
  /** original File kept for retry */
  _file?: File;
}

interface ArticleFormProps {
  categories: ICategory[];
  authors?: IAuthor[];
  tags: ITag[];
  initialData?: Partial<{
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    categoryId: string;      // primary category (legacy/URL)
    categoryIds: string[];   // all selected categories
    authorId: string;
    tagIds: string[];
    coverImage: string;
    isFeatured: boolean;
    status: "draft" | "published";
    seoTitle: string;
    seoDescription: string;
    keywords?: string;
    primaryCategory?: string;
    subcategory?: string;
    difficulty?: string;
    contentType?: string;
    seoKeywords?: string[];
  }>;
  isEdit?: boolean;
  sessionRole?: "reader" | "writer" | "superadmin";
}

/* ─── Helpers ─────────────────────────────────────────────── */

function validateFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `Unsupported file type: ${file.type || "unknown"}. Use JPEG, PNG, WebP, GIF, or SVG.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Max ${MAX_FILE_SIZE_MB} MB.`;
  }
  return null;
}

function uid() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/* ─── Image Dock Card ─────────────────────────────────────── */

function ImageDockCard({
  img,
  onInsertAtCursor,
  onRemove,
  onRetry,
  onAltChange,
}: {
  img: UploadedImage;
  onInsertAtCursor: (img: UploadedImage) => void;
  onRemove: (id: string) => void;
  onRetry: (id: string) => void;
  onAltChange: (id: string, alt: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [editingAlt, setEditingAlt] = useState(false);
  const [altDraft, setAltDraft] = useState(img.alt);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(img.markdown);
    } catch {
      const el = document.createElement("textarea");
      el.value = img.markdown;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commitAlt = () => {
    onAltChange(img.id, altDraft.trim() || "image");
    setEditingAlt(false);
  };

  const isUploading = img.status === "uploading";
  const isError = img.status === "error";

  return (
    <div
      className={[
        "group relative flex-shrink-0 w-52 rounded-xl border-2 overflow-hidden transition-all duration-500",
        img.justInserted && !isError
          ? "border-[var(--link-color)] shadow-lg shadow-blue-500/20 scale-[1.02]"
          : isError
            ? "border-red-400 dark:border-red-600"
            : "border-[var(--border-color)] hover:border-[var(--link-color)]/50 hover:shadow-md",
      ].join(" ")}
      style={{ background: "var(--bg-surface)" }}
    >
      {/* Pulse ring on insert */}
      {img.justInserted && !isError && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none animate-pulse-ring z-10"
          style={{ boxShadow: "inset 0 0 0 2px var(--link-color)" }}
        />
      )}

      {/* Thumbnail */}
      <div className="relative h-24 bg-[var(--bg-muted)] overflow-hidden">
        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <Loader2 size={20} className="animate-spin text-[var(--link-color)]" />
            <span className="text-[10px] text-[var(--text-tertiary)] font-medium">Uploading…</span>
          </div>
        ) : isError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 p-2 text-center">
            <AlertCircle size={18} className="text-red-500 shrink-0" />
            <span className="text-[9px] text-red-500 leading-snug line-clamp-3">
              {img.errorMsg || "Upload failed"}
            </span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={img.url}
            alt={img.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Just-inserted badge */}
        {img.justInserted && !isError && (
          <div
            className="absolute top-1.5 left-1.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white z-10"
            style={{ background: "var(--link-color)" }}
          >
            <Check size={9} strokeWidth={3} />
            Inserted
          </div>
        )}

        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(img.id)}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10"
          title="Remove from dock"
        >
          <X size={11} />
        </button>
      </div>

      {/* Alt text row */}
      {!isUploading && !isError && (
        <div className="px-2.5 pt-2 pb-0.5 flex items-center gap-1">
          {editingAlt ? (
            <input
              autoFocus
              value={altDraft}
              onChange={(e) => setAltDraft(e.target.value)}
              onBlur={commitAlt}
              onKeyDown={(e) => { if (e.key === "Enter") commitAlt(); if (e.key === "Escape") setEditingAlt(false); }}
              className="flex-1 text-[10px] px-1.5 py-0.5 rounded border border-[var(--link-color)] bg-[var(--bg-base)] text-[var(--text-primary)] outline-none"
              placeholder="alt text"
              maxLength={120}
            />
          ) : (
            <>
              <p
                className="flex-1 text-[10px] font-mono text-[var(--text-tertiary)] truncate leading-relaxed"
                title={img.markdown}
              >
                {img.markdown}
              </p>
              <button
                type="button"
                onClick={() => { setAltDraft(img.alt); setEditingAlt(true); }}
                className="shrink-0 text-[var(--text-tertiary)] hover:text-[var(--link-color)] transition-colors"
                title="Edit alt text"
              >
                <Pencil size={9} />
              </button>
            </>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex border-t border-[var(--border-color)] divide-x divide-[var(--border-color)] mt-1">
        {isError ? (
          /* Retry button on error */
          <button
            type="button"
            onClick={() => onRetry(img.id)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
          >
            <RefreshCw size={11} />
            Retry
          </button>
        ) : isUploading ? (
          <div className="flex-1 flex items-center justify-center py-2 text-[11px] text-[var(--text-tertiary)]">
            <Loader2 size={11} className="animate-spin mr-1" />
            Uploading
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleCopy}
              className={[
                "flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-semibold transition-all duration-200",
                copied
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)]",
              ].join(" ")}
              title="Copy markdown to clipboard"
            >
              {copied ? <><Check size={11} strokeWidth={3} /> Copied!</> : <><Copy size={11} /> Copy</>}
            </button>
            <button
              type="button"
              onClick={() => onInsertAtCursor(img)}
              className="flex-1 flex items-center justify-center gap-1 py-2 text-[11px] font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--link-color)] transition-all duration-200"
              title="Insert at cursor position"
            >
              <CornerDownRight size={11} />
              Insert
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Category icon renderer ─────────────────────────────── */

/** Returns true when the icon string is raw SVG markup, not an emoji. */
function isSvgIcon(icon: string) {
  return icon.trimStart().startsWith("<");
}

/** Renders the category icon whether it is an SVG string or an emoji character. */
function CategoryIcon({
  icon,
  size = 8,
  selected = false,
}: {
  icon: string;
  size?: number;
  selected?: boolean;
}) {
  const bg = selected
    ? "var(--link-color)"
    : "color-mix(in srgb, var(--link-color) 12%, var(--bg-muted))";

  if (isSvgIcon(icon)) {
    return (
      <span
        className="rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
        style={{
          width: size * 4,
          height: size * 4,
          background: bg,
          padding: 6,
        }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }

  return (
    <span
      className="rounded-lg flex items-center justify-center text-base leading-none shrink-0"
      style={{ width: size * 4, height: size * 4, background: bg }}
    >
      {icon}
    </span>
  );
}

/* ─── Category Select ─────────────────────────────────────── */

function CategorySelect({
  categories,
  value,
  onChange,
  inputClass,
}: {
  categories: ICategory[];
  value: string;
  onChange: (val: string) => void;
  inputClass: string;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = categories.filter((c) =>
    `${c.name} ${c.icon || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = categories.find((c) => c._id === value);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // Keyboard close
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); setSearch(""); }
  };

  if (categories.length === 0) {
    return (
      <div className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800">
        <FolderOpen size={15} className="text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">No categories found</p>
          <p className="text-[11px] text-amber-600 dark:text-amber-500 mt-0.5">
            Run <code className="bg-amber-100 dark:bg-amber-900 px-1 py-0.5 rounded font-mono">npm run seed</code> to populate categories.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`${inputClass} flex items-center justify-between text-left`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={`flex items-center gap-2 ${selected ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"}`}>
          {selected ? (
            <>
              {selected.icon && (
                <CategoryIcon icon={selected.icon} size={6} selected={false} />
              )}
              <span className="font-medium">{selected.name}</span>
            </>
          ) : (
            "Select category…"
          )}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-[var(--text-tertiary)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full rounded-xl border border-[var(--border-color)] shadow-2xl overflow-hidden"
          style={{ background: "var(--bg-surface)" }}
          role="listbox"
        >
          {/* Search bar — always visible */}
          <div className="px-2.5 pt-2.5 pb-2 border-b border-[var(--border-color)]">
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--bg-muted)] border border-[var(--border-color)]">
              <Search size={11} className="text-[var(--text-tertiary)] shrink-0" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search categories…"
                className="flex-1 text-xs bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")}>
                  <X size={10} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]" />
                </button>
              )}
            </div>
          </div>

          {/* Options — icon grid layout */}
          <div className="max-h-60 overflow-y-auto p-2" style={{ scrollbarWidth: "thin" }}>
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-xs text-[var(--text-tertiary)] text-center">
                No categories match &ldquo;{search}&rdquo;
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                {filtered.map((cat) => {
                  const isSelected = cat._id === value;
                  return (
                    <button
                      key={cat._id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(cat._id);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={[
                        "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-left transition-all duration-150 border",
                        isSelected
                          ? "border-[var(--link-color)] bg-[var(--link-color)]/10 text-[var(--link-color)] font-semibold"
                          : "border-transparent text-[var(--text-primary)] hover:bg-[var(--bg-muted)] hover:border-[var(--border-color)]",
                      ].join(" ")}
                    >
                      {cat.icon ? (
                        <CategoryIcon icon={cat.icon} size={8} selected={isSelected} />
                      ) : (
                        <span
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0"
                          style={{
                            background: isSelected ? "var(--link-color)" : "var(--bg-muted)",
                            color: isSelected ? "#fff" : "var(--text-tertiary)",
                          }}
                        >
                          {cat.name.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="flex-1 truncate text-xs font-medium">{cat.name}</span>
                      {isSelected && <Check size={12} className="shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer count */}
          {filtered.length > 0 && (
            <div className="px-3 py-1.5 border-t border-[var(--border-color)]">
              <p className="text-[10px] text-[var(--text-tertiary)]">
                {filtered.length} categor{filtered.length === 1 ? "y" : "ies"}
                {search ? ` matching "${search}"` : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Markdown Toolbar ────────────────────────────────────── */

interface ToolbarAction {
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  action: (
    value: string,
    selStart: number,
    selEnd: number
  ) => { value: string; selStart: number; selEnd: number };
  separator?: boolean;
}

/** Wrap selected text. If nothing selected, inserts placeholder. */
function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after: string,
  placeholder = "text"
): { value: string; selStart: number; selEnd: number } {
  const selected = value.slice(start, end) || placeholder;
  const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    value: newVal,
    selStart: start + before.length,
    selEnd: start + before.length + selected.length,
  };
}

/** Strip any existing list prefix from a line so we don't double-apply. */
function stripListPrefix(line: string): string {
  // ordered: "1. ", "2. " etc.
  if (/^\d+\.\s/.test(line)) return line.replace(/^\d+\.\s/, "");
  // unordered: "- " or "* "
  if (/^[-*]\s/.test(line)) return line.replace(/^[-*]\s/, "");
  return line;
}

/** Prefix each selected line (strips pre-existing list markers first). */
function prefixLines(
  value: string,
  start: number,
  end: number,
  getPrefix: (lineIndex: number) => string
): { value: string; selStart: number; selEnd: number } {
  const before = value.slice(0, start);

  // Work on whole lines
  const lineStart = before.lastIndexOf("\n") + 1;
  const lineEnd = value.indexOf("\n", end) === -1 ? value.length : value.indexOf("\n", end);

  const fullLines = value.slice(lineStart, lineEnd);
  const lines = fullLines.split("\n");
  const prefixed = lines
    .map((line, i) => getPrefix(i) + stripListPrefix(line))
    .join("\n");

  const newVal = value.slice(0, lineStart) + prefixed + value.slice(lineEnd);
  const delta = prefixed.length - fullLines.length;
  return {
    value: newVal,
    selStart: start,
    selEnd: end + delta,
  };
}

/** Insert a block (heading, HR) at current line. */
function insertBlock(
  value: string,
  start: number,
  block: string
): { value: string; selStart: number; selEnd: number } {
  const before = value.slice(0, start);
  const needsNewline = before.length > 0 && !before.endsWith("\n\n");
  const insert = `${needsNewline ? "\n\n" : ""}${block}\n\n`;
  const newVal = value.slice(0, start) + insert + value.slice(start);
  const pos = start + insert.length;
  return { value: newVal, selStart: pos, selEnd: pos };
}

function buildToolbarActions(): ToolbarAction[] {
  return [
    {
      icon: <Bold size={14} />,
      label: "Bold",
      shortcut: "Ctrl+B",
      action: (v, s, e) => wrapSelection(v, s, e, "**", "**", "bold text"),
    },
    {
      icon: <Italic size={14} />,
      label: "Italic",
      shortcut: "Ctrl+I",
      action: (v, s, e) => wrapSelection(v, s, e, "*", "*", "italic text"),
    },
    {
      icon: <Code size={14} />,
      label: "Inline Code",
      shortcut: "Ctrl+`",
      action: (v, s, e) => wrapSelection(v, s, e, "`", "`", "code"),
      separator: true,
    },
    {
      icon: <Heading2 size={14} />,
      label: "Heading 2",
      action: (v, s, e) => {
        const sel = v.slice(s, e) || "Heading";
        return wrapSelection(v, s, e, "## ", "", sel);
      },
    },
    {
      icon: <Heading3 size={14} />,
      label: "Heading 3",
      action: (v, s, e) => {
        const sel = v.slice(s, e) || "Heading";
        return wrapSelection(v, s, e, "### ", "", sel);
      },
      separator: true,
    },
    {
      icon: <List size={14} />,
      label: "Bullet List",
      action: (v, s, e) => prefixLines(v, s, e, () => "- "),
    },
    {
      icon: <ListOrdered size={14} />,
      label: "Numbered List",
      action: (v, s, e) => prefixLines(v, s, e, (i) => `${i + 1}. `),
      separator: true,
    },
    {
      icon: <Quote size={14} />,
      label: "Blockquote",
      action: (v, s, e) => prefixLines(v, s, e, () => "> "),
    },
    {
      icon: <Code2 size={14} />,
      label: "Code Block",
      action: (v, s, e) => wrapSelection(v, s, e, "```\n", "\n```", "code here"),
    },
    {
      icon: <Link2 size={14} />,
      label: "Link",
      shortcut: "Ctrl+K",
      action: (v, s, e) => {
        const sel = v.slice(s, e) || "link text";
        const before = `[${sel}](`;
        const after = ")";
        const newVal = v.slice(0, s) + before + "url" + after + v.slice(e);
        return {
          value: newVal,
          selStart: s + before.length,
          selEnd: s + before.length + 3,
        };
      },
      separator: true,
    },
    {
      icon: <Minus size={14} />,
      label: "Horizontal Rule",
      action: (v, s) => insertBlock(v, s, "---"),
    },
  ];
}

const TOOLBAR_ACTIONS = buildToolbarActions();

/* ─── Undo/Redo Hook ──────────────────────────────────────── */

function useUndoHistory(initial: string) {
  const historyRef = useRef<string[]>([initial]);
  const posRef = useRef(0);

  const push = useCallback((value: string) => {
    // Drop any future history if we're mid-stack
    historyRef.current = historyRef.current.slice(0, posRef.current + 1);
    // Don't push identical consecutive states
    if (historyRef.current[posRef.current] === value) return;
    historyRef.current.push(value);
    if (historyRef.current.length > MAX_HISTORY) historyRef.current.shift();
    posRef.current = historyRef.current.length - 1;
  }, []);

  const undo = useCallback((): string | null => {
    if (posRef.current <= 0) return null;
    posRef.current -= 1;
    return historyRef.current[posRef.current];
  }, []);

  const redo = useCallback((): string | null => {
    if (posRef.current >= historyRef.current.length - 1) return null;
    posRef.current += 1;
    return historyRef.current[posRef.current];
  }, []);

  const canUndo = () => posRef.current > 0;
  const canRedo = () => posRef.current < historyRef.current.length - 1;

  return { push, undo, redo, canUndo, canRedo };
}

/* ─── Main ArticleForm ────────────────────────────────────── */

export function ArticleForm({
  categories,
  authors,
  tags,
  initialData = {},
  isEdit = false,
  sessionRole = "writer",
}: ArticleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [autoSlug, setAutoSlug] = useState(!initialData?.slug);
  const [inlineUploading, setInlineUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const dragCounter = useRef(0);

  // Track undo/redo for content field
  const { push: pushHistory, undo: undoHistory, redo: redoHistory } = useUndoHistory(
    initialData.content || ""
  );
  // Debounce timer for history push on plain typing
  const historyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Document-level Ctrl+S → save from any field
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const [form, setForm] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    content: initialData.content || "",
    excerpt: initialData.excerpt || "",
    // Multi-category: categoryIds holds all; categoryId = first (for URL routing)
    categoryIds: initialData.categoryIds?.length
      ? initialData.categoryIds
      : initialData.categoryId
        ? [initialData.categoryId]
        : [] as string[],
    authorId: initialData.authorId || "",
    tagIds: initialData.tagIds || [],
    coverImage: initialData.coverImage || "",
    isFeatured: initialData.isFeatured || false,
    status: initialData.status || "draft",
    seoTitle: initialData.seoTitle || "",
    seoDescription: initialData.seoDescription || "",
    keywords: initialData.keywords || "",
    primaryCategory: initialData.primaryCategory || "dsa",
    subcategory: initialData.subcategory || "arrays",
    difficulty: (initialData.difficulty as "Beginner" | "Intermediate" | "Advanced") || "Beginner",
    contentType: (initialData.contentType as any) || "Tutorial",
    seoKeywords: initialData.seoKeywords || [] as string[],
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [keywordError, setKeywordError] = useState("");

  const addKeyword = (rawVal: string) => {
    const clean = rawVal.trim();
    if (!clean) return;
    
    if (form.seoKeywords.map(k => k.toLowerCase()).includes(clean.toLowerCase())) {
      setKeywordError("Keyword already exists.");
      return;
    }
    if (form.seoKeywords.length >= 15) {
      setKeywordError("Maximum of 15 keywords allowed.");
      return;
    }
    
    setForm((prev) => ({
      ...prev,
      seoKeywords: [...prev.seoKeywords, clean],
    }));
    setKeywordInput("");
    setKeywordError("");
  };

  const removeKeyword = (indexToRemove: number) => {
    setForm((prev) => ({
      ...prev,
      seoKeywords: prev.seoKeywords.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(keywordInput);
    }
  };

  /* ── Form helpers ── */
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setForm((prev) => ({
      ...prev,
      title,
      ...(autoSlug ? { slug: slugify(title) } : {}),
    }));
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    },
    []
  );

  // Content change with history recording (debounced)
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setForm((prev) => ({ ...prev, content: val }));
      // Debounce: push to history 600ms after last keystroke
      if (historyTimer.current) clearTimeout(historyTimer.current);
      historyTimer.current = setTimeout(() => pushHistory(val), 600);
    },
    [pushHistory]
  );

  const toggleTag = (tagId: string) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pCat = e.target.value;
    const subcats = CATEGORY_MAP[pCat]?.subcategories || [];
    setForm((prev) => ({
      ...prev,
      primaryCategory: pCat,
      subcategory: subcats[0] ? slugify(subcats[0]) : "",
    }));
  };

  const handleKeywordSelect = (tagName: string) => {
    setForm((prev) => {
      const existing = prev.keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
      if (existing.map(x => x.toLowerCase()).includes(tagName.toLowerCase())) {
        // Remove if clicked again
        const next = existing.filter(x => x.toLowerCase() !== tagName.toLowerCase()).join(", ");
        return { ...prev, keywords: next };
      }
      const next = [...existing, tagName].join(", ");
      return { ...prev, keywords: next };
    });
  };

  const toggleCategory = (catId: string) => {
    setForm((prev) => {
      const already = prev.categoryIds.includes(catId);
      const next = already
        ? prev.categoryIds.filter((id) => id !== catId)
        : [...prev.categoryIds, catId];
      return { ...prev, categoryIds: next };
    });
  };

  /* ── Apply a toolbar action ── */
  const applyToolbarAction = useCallback(
    (actionFn: ToolbarAction["action"]) => {
      const textarea = contentRef.current;
      if (!textarea) return;

      const s = textarea.selectionStart;
      const e = textarea.selectionEnd;
      const result = actionFn(form.content, s, e);

      setForm((prev) => ({ ...prev, content: result.value }));
      pushHistory(result.value);

      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(result.selStart, result.selEnd);
      });
    },
    [form.content, pushHistory]
  );

  /* ── Keyboard shortcuts inside textarea ── */
  const handleContentKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // ── Ctrl+S → save ──────────────────────────────────────
      if (ctrl && e.key === "s") {
        e.preventDefault();
        formRef.current?.requestSubmit();
        return;
      }

      // ── Ctrl+Z → undo ──────────────────────────────────────
      if (ctrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const val = undoHistory();
        if (val !== null) setForm((prev) => ({ ...prev, content: val }));
        return;
      }

      // ── Ctrl+Y / Ctrl+Shift+Z → redo ───────────────────────
      if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        const val = redoHistory();
        if (val !== null) setForm((prev) => ({ ...prev, content: val }));
        return;
      }

      // ── Ctrl+B → bold ───────────────────────────────────────
      if (ctrl && e.key === "b") {
        e.preventDefault();
        applyToolbarAction(TOOLBAR_ACTIONS[0].action);
        return;
      }

      // ── Ctrl+I → italic ─────────────────────────────────────
      if (ctrl && e.key === "i") {
        e.preventDefault();
        applyToolbarAction(TOOLBAR_ACTIONS[1].action);
        return;
      }

      // ── Ctrl+` → inline code ────────────────────────────────
      if (ctrl && e.key === "`") {
        e.preventDefault();
        applyToolbarAction(TOOLBAR_ACTIONS[2].action);
        return;
      }

      // ── Ctrl+K → link ───────────────────────────────────────
      if (ctrl && e.key === "k") {
        e.preventDefault();
        applyToolbarAction(TOOLBAR_ACTIONS[9].action);
        return;
      }

      // ── Enter → smart list continuation ─────────────────────
      if (e.key === "Enter" && !ctrl && !e.shiftKey) {
        const ta = e.currentTarget;
        const pos = ta.selectionStart;
        const text = ta.value;

        // Find the start of the current line
        const lineStart = text.lastIndexOf("\n", pos - 1) + 1;
        const currentLine = text.slice(lineStart, pos);

        // Match bullet: "- " or "* "
        const bulletMatch = currentLine.match(/^([-*])\s/);
        // Match ordered: "1. ", "10. " etc.
        const orderedMatch = currentLine.match(/^(\d+)\.\s/);

        if (bulletMatch || orderedMatch) {
          e.preventDefault();

          // If the current line is ONLY the prefix (empty item) → exit list
          const prefixLen = bulletMatch
            ? bulletMatch[0].length
            : (orderedMatch as RegExpMatchArray)[0].length;
          const contentAfterPrefix = currentLine.slice(prefixLen);

          if (contentAfterPrefix.trim() === "") {
            // Remove the empty list prefix and insert a plain newline
            const newText =
              text.slice(0, lineStart) + "\n" + text.slice(pos);
            setForm((prev) => ({ ...prev, content: newText }));
            pushHistory(newText);
            requestAnimationFrame(() => {
              ta.setSelectionRange(lineStart + 1, lineStart + 1);
            });
            return;
          }

          // Otherwise continue the list
          let nextPrefix: string;
          if (orderedMatch) {
            const n = parseInt(orderedMatch[1], 10);
            nextPrefix = `${n + 1}. `;
          } else {
            nextPrefix = `${bulletMatch![1]} `;
          }

          const insert = "\n" + nextPrefix;
          const newText = text.slice(0, pos) + insert + text.slice(ta.selectionEnd);
          setForm((prev) => ({ ...prev, content: newText }));
          pushHistory(newText);
          requestAnimationFrame(() => {
            const newPos = pos + insert.length;
            ta.setSelectionRange(newPos, newPos);
          });
          return;
        }
      }

      // ── Tab → insert 2 spaces ────────────────────────────────
      if (e.key === "Tab") {
        e.preventDefault();
        const ta = e.currentTarget;
        const s = ta.selectionStart;
        const val = ta.value.slice(0, s) + "  " + ta.value.slice(ta.selectionEnd);
        setForm((prev) => ({ ...prev, content: val }));
        requestAnimationFrame(() => ta.setSelectionRange(s + 2, s + 2));
      }
    },
    [undoHistory, redoHistory, applyToolbarAction, pushHistory]
  );

  /* ── Insert markdown snippet at cursor ── */
  const insertImageAtCursor = useCallback((url: string, altText = "image") => {
    const textarea = contentRef.current;
    const snippet = `![${altText}](${url})`;

    if (!textarea) {
      setForm((prev) => ({ ...prev, content: prev.content + `\n\n${snippet}\n\n` }));
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);

    const needsLeadingNewline = before.length > 0 && !before.endsWith("\n\n");
    const needsTrailingNewline = after.length > 0 && !after.startsWith("\n");
    const fullSnippet = `${needsLeadingNewline ? "\n\n" : ""}${snippet}${needsTrailingNewline ? "\n\n" : ""}`;

    const newContent = before + fullSnippet + after;
    setForm((prev) => ({ ...prev, content: newContent }));
    pushHistory(newContent);

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + fullSnippet.length;
      textarea.setSelectionRange(newPos, newPos);
      textarea.scrollTop = textarea.scrollHeight;
    });
  }, [pushHistory]);

  /* ── Check for duplicate URL in dock ── */
  const isDuplicate = useCallback(
    (url: string) => uploadedImages.some((i) => i.url === url && i.status === "done"),
    [uploadedImages]
  );

  /* ── Add placeholder card (uploading state) ── */
  const addPlaceholder = useCallback((file: File): string => {
    const id = uid();
    const placeholder: UploadedImage = {
      id,
      url: URL.createObjectURL(file),
      alt: file.name.replace(/\.[^.]+$/, ""),
      markdown: "",
      justInserted: false,
      status: "uploading",
      _file: file,
    };
    setUploadedImages((prev) => [placeholder, ...prev]);
    return id;
  }, []);

  /* ── Finalize card after successful upload ── */
  const finalizeCard = useCallback((id: string, url: string, alt: string) => {
    const markdown = `![${alt}](${url})`;
    setUploadedImages((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, url, alt, markdown, status: "done", justInserted: true }
          : i
      )
    );
    // Remove the flash highlight after 3 s
    setTimeout(() => {
      setUploadedImages((prev) =>
        prev.map((i) => (i.id === id ? { ...i, justInserted: false } : i))
      );
    }, 3000);
  }, []);

  /* ── Mark card as errored ── */
  const errorCard = useCallback((id: string, msg: string) => {
    setUploadedImages((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "error", errorMsg: msg } : i))
    );
  }, []);

  /* ── Core upload function ── */
  const uploadFile = useCallback(
    async (file: File, cardId: string, insertAfter = false) => {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });

        if (!res.ok) {
          const text = await res.text();
          let msg = `Upload failed (${res.status})`;
          try { msg = JSON.parse(text).error || msg; } catch { /* ignore */ }
          errorCard(cardId, msg);
          return;
        }

        const data = await res.json();
        if (data.success && data.url) {
          const alt = file.name.replace(/\.[^.]+$/, "");
          finalizeCard(cardId, data.url, alt);
          if (insertAfter) insertImageAtCursor(data.url, alt);
        } else {
          errorCard(cardId, data.error || "No URL returned from server");
        }
      } catch (err) {
        errorCard(cardId, err instanceof Error ? err.message : "Network error");
      }
    },
    [finalizeCard, errorCard, insertImageAtCursor]
  );

  /* ── Process a File (validate → placeholder → upload) ── */
  const processFile = useCallback(
    async (file: File, insertAfter = false) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setTimeout(() => setError(""), 6000);
        return;
      }
      const cardId = addPlaceholder(file);
      await uploadFile(file, cardId, insertAfter);
    },
    [addPlaceholder, uploadFile]
  );

  /* ── Process multiple files ── */
  const processFiles = useCallback(
    async (files: FileList | File[], insertFirst = false) => {
      const arr = Array.from(files);
      if (arr.length === 0) return;

      // Upload first file with cursor insertion if requested, rest go to dock only
      await Promise.all(arr.map((f, i) => processFile(f, insertFirst && i === 0)));
    },
    [processFile]
  );

  /* ── Toolbar: Insert Image button ── */
  const handleInlineImageInsert = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ACCEPTED_TYPES.join(",");
    input.multiple = true;
    input.onchange = () => {
      if (input.files?.length) processFiles(input.files, true);
    };
    input.click();
  };

  /* ── Clipboard paste on textarea ── */
  const handleContentPaste = useCallback(
    async (e: ClipboardEvent<HTMLTextAreaElement>) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const imageItems = Array.from(items).filter((item) => item.type.startsWith("image/"));
      if (imageItems.length === 0) return;

      e.preventDefault();
      const files = imageItems.map((item) => item.getAsFile()).filter(Boolean) as File[];
      await processFiles(files, true);
    },
    [processFiles]
  );

  /* ── Drag & drop on textarea ── */
  const handleDragEnter = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (e.dataTransfer.types.includes("Files")) setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) setIsDraggingOver(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDraggingOver(false);
      const files = e.dataTransfer.files;
      if (files.length > 0) await processFiles(files, true);
    },
    [processFiles]
  );

  /* ── Dock: insert at cursor ── */
  const handleDockInsert = useCallback(
    (img: UploadedImage) => {
      insertImageAtCursor(img.url, img.alt);
      setUploadedImages((prev) =>
        prev.map((i) => (i.id === img.id ? { ...i, justInserted: true } : i))
      );
      setTimeout(() => {
        setUploadedImages((prev) =>
          prev.map((i) => (i.id === img.id ? { ...i, justInserted: false } : i))
        );
      }, 3000);
    },
    [insertImageAtCursor]
  );

  /* ── Dock: remove ── */
  const handleDockRemove = useCallback((id: string) => {
    setUploadedImages((prev) => {
      const card = prev.find((i) => i.id === id);
      // Revoke object URL if it was a blob
      if (card?.url.startsWith("blob:")) URL.revokeObjectURL(card.url);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  /* ── Dock: retry ── */
  const handleDockRetry = useCallback(
    (id: string) => {
      const card = uploadedImages.find((i) => i.id === id);
      if (!card?._file) return;
      setUploadedImages((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: "uploading", errorMsg: undefined } : i))
      );
      uploadFile(card._file, id, false);
    },
    [uploadedImages, uploadFile]
  );

  /* ── Dock: alt text change ── */
  const handleAltChange = useCallback((id: string, alt: string) => {
    setUploadedImages((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, alt, markdown: `![${alt}](${i.url})` } : i
      )
    );
  }, []);

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!form.title.trim()) { setError("Title is required."); setIsLoading(false); return; }
    if (!form.excerpt.trim()) { setError("Excerpt is required."); setIsLoading(false); return; }
    if (!form.content.trim()) { setError("Content is required."); setIsLoading(false); return; }
    if (!form.primaryCategory || !form.subcategory) { setError("Category and Subcategory are required."); setIsLoading(false); return; }
    if (form.seoKeywords.length < 3 || form.seoKeywords.length > 15) {
      setError("Please specify between 3 and 15 SEO Keywords.");
      setIsLoading(false);
      return;
    }

    // Warn about pending uploads
    const pendingUploads = uploadedImages.filter((i) => i.status === "uploading").length;
    if (pendingUploads > 0) {
      setError(`${pendingUploads} image(s) are still uploading. Please wait or remove them before saving.`);
      setIsLoading(false);
      return;
    }

    try {
      // Find dynamic category mapping matching client subcategory selection
      const matchedCat = categories.find(c => c.slug === form.subcategory.toLowerCase());
      const resolvedCatId = matchedCat ? matchedCat._id : "";

      const payload = {
        title: form.title, slug: form.slug, content: form.content,
        excerpt: form.excerpt,
        categoryId: resolvedCatId,
        categoryIds: resolvedCatId ? [resolvedCatId] : [],
        primaryCategory: form.primaryCategory,
        subcategory: form.subcategory,
        difficulty: form.difficulty,
        contentType: form.contentType,
        authorId: form.authorId,
        coverImage: form.coverImage, isFeatured: form.isFeatured,
        status: form.status,
        seo: { 
          metaTitle: form.seoTitle || form.title, 
          metaDescription: form.seoDescription || form.excerpt,
          keywords: form.seoKeywords
        },
        keywords: form.seoKeywords.join(", "),
      };

      const url = isEdit ? `/api/articles/${initialData._id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      setSuccess(isEdit ? "Article updated!" : "Article created!");
      if (!isEdit) router.push("/admin/articles");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Style helpers ── */
  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] text-sm placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--link-color)]/30 focus:border-[var(--link-color)] transition-all";
  const labelClass = "block text-sm font-medium text-[var(--text-primary)] mb-1.5";
  const panelClass = "rounded-xl border border-[var(--border-color)] p-4 space-y-4";

  const pendingCount = uploadedImages.filter((i) => i.status === "uploading").length;
  const errorCount = uploadedImages.filter((i) => i.status === "error").length;

  /* ─────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0%   { opacity: 1; }
          50%  { opacity: 0.4; }
          100% { opacity: 1; }
        }
        .animate-pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }
        @keyframes drop-glow {
          0%,100% { box-shadow: 0 0 0 2px var(--link-color), inset 0 0 20px rgba(37,99,235,0.08); }
          50%      { box-shadow: 0 0 0 3px var(--link-color), inset 0 0 32px rgba(37,99,235,0.14); }
        }
        .drop-active { animation: drop-glow 1s ease-in-out infinite; }
        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 28px;
          border-radius: 6px;
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.12s ease;
          background: transparent;
        }
        .toolbar-btn:hover {
          background: var(--bg-muted);
          color: var(--text-primary);
          border-color: var(--border-color);
        }
        .toolbar-btn:active {
          transform: scale(0.94);
          background: color-mix(in srgb, var(--link-color) 10%, var(--bg-muted));
          color: var(--link-color);
        }
        .toolbar-separator {
          width: 1px;
          height: 18px;
          background: var(--border-color);
          flex-shrink: 0;
          margin: 0 2px;
        }
      `}</style>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        {/* Banners */}
        {error && (
          <div className="p-3.5 rounded-xl text-sm text-red-700 bg-red-50 border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800 flex items-start gap-2">
            <AlertCircle size={15} className="mt-0.5 shrink-0" /><span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3.5 rounded-xl text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800 flex items-start gap-2">
            <Check size={15} className="mt-0.5 shrink-0" /><span>{success}</span>
          </div>
        )}
        {pendingCount > 0 && (
          <div className="p-3 rounded-xl text-xs text-blue-700 bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800 flex items-center gap-2">
            <Loader2 size={13} className="animate-spin shrink-0" />
            {pendingCount} image{pendingCount > 1 ? "s" : ""} uploading — save will be blocked until complete.
          </div>
        )}
        {errorCount > 0 && (
          <div className="p-3 rounded-xl text-xs text-amber-700 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 flex items-center gap-2">
            <AlertCircle size={13} className="shrink-0" />
            {errorCount} image{errorCount > 1 ? "s" : ""} failed — use the Retry button in the dock or remove them.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ──────────── Main column ──────────── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div>
              <label htmlFor="title" className={labelClass}>
                Title <span className="text-red-500">*</span>
              </label>
              <input id="title" type="text" name="title" value={form.title}
                onChange={handleTitleChange} required placeholder="Enter article title…"
                className={inputClass} />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className={labelClass}>URL Slug</label>
              <div className="flex gap-2">
                <input id="slug" type="text" name="slug" value={form.slug}
                  onChange={(e) => { setAutoSlug(false); handleChange(e); }}
                  placeholder="auto-generated-from-title"
                  className={`${inputClass} flex-1 font-mono text-xs`} />
                <Button type="button" variant="secondary" size="sm"
                  onClick={() => { setAutoSlug(true); setForm((p) => ({ ...p, slug: slugify(p.title) })); }}>
                  Reset
                </Button>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className={labelClass}>
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea id="excerpt" name="excerpt" value={form.excerpt} onChange={handleChange}
                required rows={3} maxLength={300}
                placeholder="Short description used for SEO and article cards…"
                className={inputClass} />
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                {form.excerpt.length}/300 characters
              </p>
            </div>

            {/* ── Content editor ── */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="content" className={labelClass + " mb-0"}>
                  Content (Markdown) <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleInlineImageInsert}
                  disabled={inlineUploading}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border-color)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:border-[var(--link-color)] hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Upload image(s) and insert at cursor — also supports drag & drop and Ctrl+V paste"
                >
                  {inlineUploading ? (
                    <><Loader2 size={12} className="animate-spin" />Uploading…</>
                  ) : (
                    <><ImageIcon size={12} />Insert Image</>
                  )}
                </button>
              </div>

              {/* ── Markdown Toolbar ── */}
              <div
                className="flex items-center gap-0.5 flex-wrap px-2 py-1.5 rounded-t-lg border border-b-0 border-[var(--border-color)]"
                style={{ background: "var(--bg-surface)" }}
              >
                {/* Undo / Redo */}
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Undo (Ctrl+Z)"
                  onClick={() => {
                    const val = undoHistory();
                    if (val !== null) setForm((prev) => ({ ...prev, content: val }));
                  }}
                >
                  <Undo2 size={13} />
                </button>
                <button
                  type="button"
                  className="toolbar-btn"
                  title="Redo (Ctrl+Y)"
                  onClick={() => {
                    const val = redoHistory();
                    if (val !== null) setForm((prev) => ({ ...prev, content: val }));
                  }}
                >
                  <Redo2 size={13} />
                </button>

                <div className="toolbar-separator" />

                {/* Formatting actions */}
                {TOOLBAR_ACTIONS.map((action, idx) => (
                  <span key={idx} className="contents">
                    <button
                      type="button"
                      className="toolbar-btn"
                      title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
                      onClick={() => applyToolbarAction(action.action)}
                    >
                      {action.icon}
                    </button>
                    {action.separator && <div className="toolbar-separator" />}
                  </span>
                ))}

                {/* Word count / shortcuts hint */}
                <span className="ml-auto text-[10px] text-[var(--text-tertiary)] hidden sm:block pr-1">
                  Ctrl+B · I · K · Z
                </span>
              </div>

              <div className="relative">
                <textarea
                  ref={contentRef}
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleContentChange}
                  onKeyDown={handleContentKeyDown}
                  onPaste={handleContentPaste}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  required
                  rows={22}
                  placeholder={`Write your article in Markdown…\n\nPaste an image with Ctrl+V, drag & drop a file, or click "Insert Image" above.`}
                  className={[
                    inputClass,
                    "font-mono text-sm leading-relaxed transition-all duration-200 rounded-t-none",
                    isDraggingOver ? "drop-active border-[var(--link-color)] bg-blue-50/30 dark:bg-blue-950/20" : "",
                  ].join(" ")}
                  style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                />
                {/* Drag overlay label */}
                {isDraggingOver && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-b-lg">
                    <div
                      className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-sm"
                      style={{ background: "rgba(37,99,235,0.12)" }}
                    >
                      <ImageIcon size={28} className="text-[var(--link-color)]" />
                      <span className="text-sm font-bold text-[var(--link-color)]">Drop to upload & insert</span>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                {form.content.split(/\s+/).filter(Boolean).length} words ·{" "}
                {Math.ceil(form.content.split(/\s+/).filter(Boolean).length / 200)} min read
              </p>
            </div>

            {/* ════════ IMAGE DOCK ════════ */}
            {uploadedImages.length > 0 && (
              <div
                className="rounded-xl border-2 overflow-hidden transition-all duration-300"
                style={{
                  borderColor: errorCount > 0 ? "var(--border-color)" : "var(--link-color)",
                  background: "var(--bg-surface)",
                  boxShadow: errorCount > 0 ? "none" : "0 0 0 3px rgba(37,99,235,0.08)",
                }}
              >
                {/* Dock header */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border-color)]"
                  style={{ background: "linear-gradient(135deg, rgba(37,99,235,0.06), rgba(124,58,237,0.04))" }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: "var(--link-color)" }}
                    >
                      <ImageIcon size={11} className="text-white" />
                    </div>
                    <span className="text-xs font-bold text-[var(--text-primary)]">Image Dock</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: "var(--link-color)" }}
                    >
                      {uploadedImages.length}
                    </span>
                    {pendingCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 font-semibold flex items-center gap-1">
                        <Loader2 size={8} className="animate-spin" />{pendingCount} uploading
                      </span>
                    )}
                    {errorCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 font-semibold flex items-center gap-1">
                        <AlertCircle size={8} />{errorCount} failed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Move size={11} className="text-[var(--text-tertiary)]" />
                    <p className="text-[10px] text-[var(--text-tertiary)] hidden sm:block">
                      <strong>Copy</strong> then paste, or <strong>Insert</strong> at cursor · <strong>✏️</strong> to edit alt text
                    </p>
                  </div>
                </div>

                {/* Card strip */}
                <div
                  className="flex gap-3 p-3 overflow-x-auto pb-3"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {uploadedImages.map((img) => (
                    <ImageDockCard
                      key={img.id}
                      img={img}
                      onInsertAtCursor={handleDockInsert}
                      onRemove={handleDockRemove}
                      onRetry={handleDockRetry}
                      onAltChange={handleAltChange}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* SEO */}
            <details
              className="group rounded-xl border border-[var(--border-color)] overflow-hidden"
              style={{ background: "var(--bg-surface)" }}
            >
              <summary className="cursor-pointer text-sm font-semibold text-[var(--text-primary)] px-4 py-3 select-none flex items-center justify-between hover:bg-[var(--bg-muted)] transition-colors">
                <span>🔍 SEO Settings</span>
                <span className="text-xs font-normal text-[var(--text-tertiary)]">optional</span>
              </summary>
              <div className="px-4 pb-4 pt-3 space-y-4 border-t border-[var(--border-color)]">
                <div>
                  <label htmlFor="seoTitle" className={labelClass}>Meta Title</label>
                  <input id="seoTitle" type="text" name="seoTitle" value={form.seoTitle}
                    onChange={handleChange} placeholder={form.title || "Defaults to article title"}
                    className={inputClass} />
                </div>
                <div>
                  <label htmlFor="seoDescription" className={labelClass}>Meta Description</label>
                  <textarea id="seoDescription" name="seoDescription" value={form.seoDescription}
                    onChange={handleChange} rows={2}
                    placeholder={form.excerpt || "Defaults to excerpt"}
                    className={inputClass} />
                </div>
              </div>
            </details>
          </div>

          {/* ──────────── Sidebar ──────────── */}
          <div className="space-y-4">
            {/* Publish */}
            <div className={panelClass} style={{ background: "var(--bg-surface)" }}>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">Publish</h3>
              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select id="status" name="status" value={form.status}
                  onChange={handleChange} className={inputClass}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <label className="flex items-center gap-2 cursor-pointer py-1">
                <input type="checkbox" name="isFeatured" checked={form.isFeatured}
                  onChange={handleChange} className="w-4 h-4 rounded accent-[var(--link-color)]" />
                <span className="text-sm text-[var(--text-primary)]">Featured article</span>
              </label>
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}
                disabled={isLoading || pendingCount > 0}>
                {pendingCount > 0
                  ? `Waiting for ${pendingCount} upload${pendingCount > 1 ? "s" : ""}…`
                  : isEdit ? "Update Article" : "Create Article"}
              </Button>
            </div>

            {/* Cover Image */}
            <div className={panelClass} style={{ background: "var(--bg-surface)" }}>
              <h3 className="font-semibold text-sm text-[var(--text-primary)]">Cover Image</h3>
              <ImageUploader
                currentUrl={form.coverImage}
                onUpload={(url) => setForm((prev) => ({ ...prev, coverImage: url }))}
                label="Drag & drop or click to upload cover"
              />
              <div>
                <label htmlFor="coverImage" className="block text-xs font-medium text-[var(--text-tertiary)] mb-1">
                  Or paste image URL
                </label>
                <input id="coverImage" type="text" name="coverImage" value={form.coverImage}
                  onChange={handleChange} placeholder="https://res.cloudinary.com/…"
                  className={`${inputClass} text-xs`} />
              </div>
            </div>

            {/* Step 1 & Step 2: Category & Subcategory Selection */}
            <div className={panelClass} style={{ background: "var(--bg-surface)" }}>
              <label htmlFor="primaryCategory" className={labelClass}>
                Step 1: Select Category <span className="text-red-500">*</span>
              </label>
              <select
                id="primaryCategory"
                name="primaryCategory"
                value={form.primaryCategory}
                onChange={handleCategoryChange}
                className={inputClass}
              >
                <option value="">Select Category…</option>
                {Object.keys(CATEGORY_MAP).map((slug) => (
                  <option key={slug} value={slug}>
                    {CATEGORY_MAP[slug].name}
                  </option>
                ))}
              </select>

              <label htmlFor="subcategory" className={labelClass + " mt-4"}>
                Step 2: Select Subcategory <span className="text-red-500">*</span>
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={form.subcategory}
                onChange={handleChange}
                className={inputClass}
                disabled={!form.primaryCategory}
              >
                <option value="">Select Subcategory…</option>
                {(CATEGORY_MAP[form.primaryCategory]?.subcategories || []).map((sub) => (
                  <option key={slugify(sub)} value={slugify(sub)}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>


            {/* Difficulty & Content Type (Auto Tags) */}
            <div className={panelClass} style={{ background: "var(--bg-surface)" }}>
              <label htmlFor="difficulty" className={labelClass}>
                Difficulty <span className="text-red-500">*</span>
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={form.difficulty}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>

              <label htmlFor="contentType" className={labelClass + " mt-4"}>
                Content Type <span className="text-red-500">*</span>
              </label>
              <select
                id="contentType"
                name="contentType"
                value={form.contentType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Tutorial">Tutorial</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="Best Practices">Best Practices</option>
                <option value="Roadmap">Roadmap</option>
                <option value="Project">Project</option>
                <option value="Cheat Sheet">Cheat Sheet</option>
                <option value="Notes">Notes</option>
              </select>

              <div className="mt-4 p-3.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--bg-base)]/50">
                <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                  Auto Generated Tags (Read-only Preview)
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--link-color)]/10 text-[var(--link-color)] border border-[var(--link-color)]/20">
                    #{form.difficulty}
                  </span>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[var(--link-color)]/10 text-[var(--link-color)] border border-[var(--link-color)]/20">
                    #{form.contentType.replace(/\s+/g, "")}
                  </span>
                </div>
              </div>
            </div>

            {/* SEO Keywords manual entry Tag Input */}
            <div className={panelClass} style={{ background: "var(--bg-surface)" }}>
              <label htmlFor="keywordInput" className={labelClass}>
                SEO Keywords (Manual Entry) <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  id="keywordInput"
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  placeholder="Type keyword and press Enter or comma"
                  className={inputClass + " flex-1"}
                />
                <button
                  type="button"
                  onClick={() => addKeyword(keywordInput)}
                  className="px-3.5 py-2 rounded-lg bg-[var(--link-color)] text-white font-semibold text-sm hover:opacity-90 transition-opacity active:scale-95"
                >
                  Add
                </button>
              </div>
              {keywordError && (
                <p className="text-xs text-red-500 font-medium mt-1">{keywordError}</p>
              )}
              <p className="text-[10px] text-[var(--text-tertiary)] mt-1">
                Enter between 3 and 15 unique keywords. Duplicates will be filtered out.
              </p>

              {form.seoKeywords.length > 0 && (
                <div className="mt-3.5 pt-3 border-t border-[var(--border-color)]/50">
                  <p className="text-xs font-semibold text-[var(--text-secondary)] mb-2">
                    Current Keywords ({form.seoKeywords.length}/15)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {form.seoKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] font-medium"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => removeKeyword(idx)}
                          className="text-[var(--text-tertiary)] hover:text-red-500 font-bold ml-1 transition-colors"
                          title="Remove keyword"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </>
  );
}