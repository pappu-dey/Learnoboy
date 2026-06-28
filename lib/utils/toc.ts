import type { TocItem } from "@/types";


export function extractTableOfContents(markdown: string): TocItem[] {
  if (!markdown) return [];
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TocItem[] = [];
  let match;
  
  
  const idCounts = new Map<string, number>();

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim().replace(/\*\*|__|`/g, "");
    let baseId = text
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
    
    if (!baseId) baseId = "heading";
    
    let uniqueId = baseId;
    if (idCounts.has(baseId)) {
      const count = idCounts.get(baseId)! + 1;
      idCounts.set(baseId, count);
      uniqueId = `${baseId}-${count}`;
    } else {
      idCounts.set(baseId, 0);
    }

    items.push({ id: uniqueId, text, level });
  }

  return items;
}
