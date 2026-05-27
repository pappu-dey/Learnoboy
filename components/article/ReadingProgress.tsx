"use client";

import { useReadingProgress } from "@/hooks/useReadingProgress";

export function ReadingProgress() {
  const progress = useReadingProgress("article-body");

  return (
    <div
      id="reading-progress-bar"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
}
