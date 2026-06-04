"use client";

import { useState, useEffect } from "react";
import { List, ChevronDown, Check } from "lucide-react";
import type { TocItem } from "@/types";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  // Only keep level 2 (##) headings
  const h2Items = items.filter((item) => item.level === 2);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>([]);

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

  // Track headings that have entered the viewport or been scrolled past (scrolled-to headings)
  useEffect(() => {
    if (h2Items.length === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setReadIds((prev) => {
            const updated = [...prev];
            let changed = false;
            
            h2Items.forEach((item) => {
              if (!updated.includes(item.id)) {
                const el = document.getElementById(item.id);
                if (el) {
                  const rect = el.getBoundingClientRect();
                  // Mark as read if the heading top has crossed the viewport upper section
                  if (rect.top <= 200) {
                    updated.push(item.id);
                    changed = true;
                  }
                }
              }
            });
            
            return changed ? updated : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
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
          isOpen ? "pb-2" : ""
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

      {/* Thin Progress Bar under header */}
      <div className="w-full h-1 bg-[var(--border-color)] rounded-full mt-2.5 overflow-hidden">
        <div 
          className="h-full bg-[var(--link-color)] transition-all duration-300 rounded-full"
          style={{ width: `${(readIds.length / h2Items.length) * 100}%` }}
        />
      </div>

      {isOpen && (
        <ol className="space-y-1 mt-3 animate-fade-in max-h-[60vh] overflow-y-auto pr-1">
          {h2Items.map((item) => {
            const isRead = readIds.includes(item.id);
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="relative flex items-center justify-between text-sm py-1.5 pl-3 pr-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-base)]"
                  style={{
                    color: isActive
                      ? "var(--link-color)"
                      : isRead
                      ? "var(--text-secondary)"
                      : "var(--text-tertiary)",
                    fontWeight: isActive ? 600 : 400,
                    borderLeft: isActive
                      ? "2px solid var(--link-color)"
                      : "2px solid transparent",
                    borderRadius: isActive ? "0 8px 8px 0" : "8px",
                  }}
                  onClick={(e) => {
                    // Check if left click and no modifier keys (command, control, shift, alt) are pressed
                    if (
                      e.button !== 0 ||
                      e.ctrlKey ||
                      e.metaKey ||
                      e.shiftKey ||
                      e.altKey
                    ) {
                      return; // Let browser handle it natively (e.g. open in new tab)
                    }

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
                  <span className="truncate pr-2">{item.text}</span>
                  {isRead && (
                    <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-green-500/10 text-green-500 animate-fade-in" title="Section Read">
                      <Check size={10} strokeWidth={3} />
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}

export { extractTableOfContents } from "@/lib/utils/toc";
