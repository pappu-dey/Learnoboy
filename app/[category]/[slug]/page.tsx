import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug, getRelatedArticles, getAllArticleSlugs } from "@/lib/services/articleService";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { extractTableOfContents } from "@/lib/utils/toc";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { getArticleMetadata, getArticleJsonLd, getBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";
import type { ICategory } from "@/types";
import { stripFirstH1 } from "@/lib/utils/stripFirstHeading";

interface PageParams {
  params: Promise<{ category: string; slug: string }>;
}

// ISR: revalidate every 5 minutes
export const revalidate = 300;

// Static generation — pre-render known slugs at build time
export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();
    return slugs.map(({ category, slug }) => ({ category, slug }));
  } catch {
    return [];
  }
}

// Dynamic SEO metadata
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { category, slug } = await params;
  const article = await getArticleBySlug(category, slug).catch(() => null);
  if (!article) return { title: "Article Not Found" };
  return getArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageParams) {
  const { category: categorySlug, slug } = await params;

  const article = await getArticleBySlug(categorySlug, slug).catch(() => null);
  if (!article) notFound();

  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;

  const relatedArticles = await getRelatedArticles(
    typeof article.category === "object" ? article.category._id : (article.category as string),
    article.slug,
    4
  ).catch(() => []);

  const strippedContent = stripFirstH1(article.content);
  const tocItems = extractTableOfContents(strippedContent);
  const jsonLd = getArticleJsonLd(article);
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    ...(category ? [{ name: category.name, url: `${BASE_URL}/${category.slug}` }] : []),
    { name: article.title, url: `${BASE_URL}/${categorySlug}/${slug}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Reading progress bar */}
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 xl:gap-12">
          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-4xl">
            <ArticleHeader article={article} />

            {/* Cover image */}
            {article.coverImage && (
              <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {/* Mobile ToC */}
            {tocItems.length > 0 && (
              <div className="xl:hidden mb-8">
                <TableOfContents items={tocItems} />
              </div>
            )}

            {/* Article Body */}
            <ArticleBody content={strippedContent} />

            {/* Related Articles */}
            <RelatedArticles articles={relatedArticles} />
          </article>

          {/* Sidebar ToC */}
          {tocItems.length > 0 && (
            <aside className="hidden xl:block w-64 flex-shrink-0" aria-label="Article sidebar">
              <TableOfContents items={tocItems} />
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
