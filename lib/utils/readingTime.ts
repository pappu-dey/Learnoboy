/**
 * Estimates reading time for a given text.
 * Based on average adult reading speed of 200-238 words per minute.
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 220;
  // Strip markdown syntax for accurate word count
  const plainText = content
    .replace(/#{1,6}\s/g, "") // headers
    .replace(/\*\*|__|~~|\*/g, "") // bold, italic, strikethrough
    .replace(/`{1,3}[^`]*`{1,3}/g, "") // inline code and code blocks
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") // images
    .replace(/^\s*[-*+]\s/gm, "") // list items
    .replace(/^\s*\d+\.\s/gm, "") // ordered list items
    .replace(/\n+/g, " ") // newlines
    .trim();

  const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
