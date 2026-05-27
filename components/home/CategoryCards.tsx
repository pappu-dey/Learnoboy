import Link from "next/link";
import type { ICategory } from "@/types";
import { ArrowRight, Layers } from "lucide-react";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

interface CategoryCardsProps {
  categories: ICategory[];
}

export function CategoryCards({ categories }: CategoryCardsProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mb-10" aria-label="Browse by category">
      <div className="flex items-center gap-2 mb-4">
        <Layers size={18} style={{ color: "var(--link-color)" }} />
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Browse by Category
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/${category.slug}`}
            className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl card-hover text-sm font-medium transition-all duration-200"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Small icon with subtle color bg */}
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-transform duration-200 group-hover:scale-110"
              style={{ background: `${category.color}15`, color: category.color }}
            >
              <CategoryIcon icon={category.icon} />
            </div>

            <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors">
              {category.name}
            </span>

            {/* Subtle count badge */}
            <span
              className="text-xs px-2 py-0.5 rounded-md transition-colors bg-[var(--bg-muted)] text-[var(--text-secondary)] group-hover:bg-[var(--link-color)] group-hover:text-white"
            >
              {category.articleCount}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
