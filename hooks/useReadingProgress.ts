"use client";

import { useEffect, useState } from "react";

/**
 * Tracks reading progress (0–100) based on scroll position
 * relative to the article body element.
 */
export function useReadingProgress(targetId = "article-body"): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const target = document.getElementById(targetId);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const totalHeight = rect.height;
      const scrolled = Math.max(0, -rect.top);
      const percentage = Math.min(100, (scrolled / totalHeight) * 100);
      setProgress(Math.round(percentage));
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress(); // initial

    return () => window.removeEventListener("scroll", updateProgress);
  }, [targetId]);

  return progress;
}
