"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg" style={{ background: "var(--bg-surface)" }} />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="
        relative w-9 h-9 flex items-center justify-center rounded-lg
        border border-[var(--border-color)] bg-[var(--bg-surface)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)]
        hover:bg-[var(--bg-muted)] transition-all duration-200 cursor-pointer
      "
    >
      <span
        className="absolute transition-all duration-300"
        style={{ opacity: isDark ? 0 : 1, transform: isDark ? "scale(0.5) rotate(90deg)" : "scale(1) rotate(0deg)" }}
      >
        <Moon size={16} />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{ opacity: isDark ? 1 : 0, transform: isDark ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(-90deg)" }}
      >
        <Sun size={16} />
      </span>
    </button>
  );
}
