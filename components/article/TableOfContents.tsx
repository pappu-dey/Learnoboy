"use client";

import { useState, useEffect } from "react";
import { List } from "lucide-react";
import type { TocItem } from "@/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const headingIds = items.map((item) => item.id);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headingIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl p-4 sticky top-20"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[var(--border-color)]">
        <List size={14} style={{ color: "var(--link-color)" }} />
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          Contents
        </span>
      </div>
      <ol className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingLeft: `${(item.level - 2) * 12}px` }}
          >
            <a
              href={`#${item.id}`}
              className="block text-sm py-0.5 transition-colors duration-200"
              style={{
                color:
                  activeId === item.id
                    ? "var(--link-color)"
                    : "var(--text-secondary)",
                fontWeight: activeId === item.id ? 600 : 400,
              }}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById(item.id);
                if (el) {
                  const top = el.getBoundingClientRect().top + window.scrollY - 90;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export { extractTableOfContents } from "@/lib/utils/toc";
