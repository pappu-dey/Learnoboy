"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown } from "lucide-react";
import type { TocItem } from "@/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  // Only keep level 2 (##) headings
  const h2Items = items.filter((item) => item.level === 2);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  // Set initial open state: open on desktop (xl width >= 1280px), collapsed on mobile
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 1280);
    }
  }, []);

  useEffect(() => {
    if (h2Items.length === 0) return;

    const headingIds = h2Items.map((item) => item.id);

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
  }, [h2Items]);

  if (h2Items.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="rounded-xl p-4 sticky top-20 transition-all duration-300"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-color)",
        boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left cursor-pointer group focus:outline-none transition-all duration-200 ${
          isOpen ? "pb-2.5 border-b border-[var(--border-color)]" : ""
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <List size={14} style={{ color: "var(--link-color)" }} />
          <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors">
            Contents
          </span>
        </div>
        <ChevronDown
          size={14}
          className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-transform duration-300"
          style={{
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>

      {isOpen && (
        <ol className="space-y-1.5 mt-3 animate-fade-in">
          {h2Items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className="relative block text-sm py-1.5 pl-3 pr-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-base)]"
                style={{
                  color:
                    activeId === item.id
                      ? "var(--link-color)"
                      : "var(--text-secondary)",
                  fontWeight: activeId === item.id ? 600 : 400,
                  borderLeft:
                    activeId === item.id
                      ? "2px solid var(--link-color)"
                      : "2px solid transparent",
                  borderRadius: activeId === item.id ? "0 8px 8px 0" : "8px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById(item.id);
                  if (el) {
                    const top =
                      el.getBoundingClientRect().top + window.scrollY - 90;
                    window.scrollTo({ top, behavior: "smooth" });
                    // On mobile, automatically collapse dropdown after clicking
                    if (window.innerWidth < 1280) {
                      setIsOpen(false);
                    }
                  }
                }}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}

export { extractTableOfContents } from "@/lib/utils/toc";
