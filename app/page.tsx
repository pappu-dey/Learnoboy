import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { LatestArticles } from "@/components/home/LatestArticles";
import { CategoryCards } from "@/components/home/CategoryCards";
import {
  getFeaturedArticles,
  getLatestArticles,
} from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const [featuredArticles, latestArticles, categories] = await Promise.all([
    getFeaturedArticles(3).catch(() => []),
    getLatestArticles(8).catch(() => []),
    getAllCategories().catch(() => []),
  ]);

  return (
    <>
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Cards */}
        <CategoryCards categories={categories} />

        {/* Featured Articles */}
        <FeaturedArticles articles={featuredArticles} />

        {/* Latest Articles */}
        <LatestArticles articles={latestArticles} />

        {/* Empty state when DB has no data yet */}
        {featuredArticles.length === 0 && latestArticles.length === 0 && (
          <div
            className="text-center py-20 rounded-2xl border border-[var(--border-color)] mb-16"
            style={{ background: "var(--bg-surface)" }}
          >
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
              No articles yet
            </h2>
            <p className="text-[var(--text-secondary)] mb-6">
              Run the seed script to populate sample articles, or create your first article in the admin dashboard.
            </p>
            <a
              href="/admin/articles/new"
              className="inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--link-color)" }}
            >
              Create First Article
            </a>
          </div>
        )}
      </div>
    </>
  );
}
