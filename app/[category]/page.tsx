import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getArticles } from "@/lib/services/articleService";
import { getCategoryBySlug, getAllCategories } from "@/lib/services/categoryService";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { getBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}


export const revalidate = 300;


export async function generateStaticParams() {
  try {
    const categories = await getAllCategories();
    return categories.map((cat) => ({
      category: cat.slug,
    }));
  } catch {
    return [];
  }
}


export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug).catch(() => null);

  if (!category) {
    return {
      title: "Category Not Found | Learno-Boy",
      description: "This category does not exist or has been removed.",
    };
  }

  return {
    title: `${category.name} Tutorials & Articles | Learno-Boy`,
    description: category.description || `Browse high-quality ${category.name} developer articles, tutorials, and best practices.`,
    alternates: {
      canonical: `${BASE_URL}/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Articles | Learno-Boy`,
      description: category.description || `Explore ${category.name} tutorials on Learno-Boy.`,
      url: `${BASE_URL}/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;

  
  const category = await getCategoryBySlug(categorySlug).catch(() => null);
  if (!category) notFound();

  
  const paginatedResult = await getArticles({
    category: categorySlug,
    limit: 20, 
    status: "published",
    sort: "newest",
  }).catch(() => ({ data: [], total: 0 }));

  const articles = paginatedResult.data;

  
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: category.name, url: `${BASE_URL}/${category.slug}` },
  ]);

  return (
    <>
      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {}
        <div
          className="p-8 md:p-10 rounded-2xl border border-[var(--border-color)] mb-12 relative overflow-hidden"
          style={{
            background: "var(--bg-surface)",
          }}
        >
          {}
          <div
            className="absolute -right-16 -top-16 w-64 h-64 rounded-full blur-3xl opacity-10 pointer-events-none"
            style={{ backgroundColor: category.color }}
          />

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm flex-shrink-0"
              style={{
                background: `${category.color}18`,
                border: `1px solid ${category.color}20`,
                color: category.color,
              }}
            >
              <CategoryIcon icon={category.icon} />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                {category.name}
              </h1>
              <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
                {category.description || `High-quality ${category.name} tutorials, concepts, and developer guides.`}
              </p>
              <div className="flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: category.color }}
                />
                {paginatedResult.total} {paginatedResult.total === 1 ? "Article" : "Articles"} Available
              </div>
            </div>
          </div>
        </div>

        {}
        <div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
            <BookOpen size={20} style={{ color: category.color }} />
            Articles in {category.name}
          </h2>

          {articles.length === 0 ? (
            <div
              className="text-center py-20 rounded-2xl border border-[var(--border-color)]"
              style={{ background: "var(--bg-surface)" }}
            >
              <div className="text-5xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                No articles found
              </h3>
              <p className="text-[var(--text-secondary)] max-w-md mx-auto">
                We are currently working on articles for this category. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
              {articles.map((article) => (
                <ArticleCard key={article._id} article={article} variant="default" />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
