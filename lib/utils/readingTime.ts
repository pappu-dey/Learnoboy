
export function calculateReadingTime(content: string): number {
  if (!content || typeof content !== "string" || !content.trim()) return 1;

  const wordsPerMinute = 220;
  
  const plainText = content
    .replace(/```[\s\S]*?```/g, "") 
    .replace(/`[^`]*`/g, "") 
    .replace(/#{1,6}\s/g, "") 
    .replace(/\*\*|__|~~|\*/g, "") 
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") 
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "") 
    .replace(/^\s*[-*+]\s/gm, "") 
    .replace(/^\s*\d+\.\s/gm, "") 
    .replace(/\n+/g, " ") 
    .trim();

  const wordCount = plainText.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
