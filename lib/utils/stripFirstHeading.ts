export function stripFirstH1(markdown: string): string {
  if (!markdown) return "";
  return markdown.replace(/^#\s+.+\n?/, "").trimStart();
}
