import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import connectDB from "@/lib/mongodb";
import { Article, Category } from "@/lib/models";
import { getArticleBySubcategoryAndSlug, getRelatedArticles, getAllArticleSlugs, getArticles } from "@/lib/services/articleService";
import { ArrowLeft, BookOpen } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleBody } from "@/components/article/ArticleBody";
import { TableOfContents } from "@/components/article/TableOfContents";
import { extractTableOfContents } from "@/lib/utils/toc";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { ReadingProgress } from "@/components/article/ReadingProgress";
import { getArticleMetadata, getArticleJsonLd, getBreadcrumbJsonLd, BASE_URL } from "@/lib/utils/seo";
import type { IArticle, ICategory, IAuthor, ITag } from "@/types";
import { stripFirstH1 } from "@/lib/utils/stripFirstHeading";
import Link from "next/link";
import { FAQSection } from "@/components/article/FAQSection";
import { ReadNext } from "@/components/article/ReadNext";
import { AuthorFollowCard } from "@/components/article/AuthorFollowCard";
import { ArticleMetrics } from "@/components/article/ArticleMetrics";
import { ArticleComments } from "@/components/article/ArticleComments";


function parseFaqsFromContent(content: string): { question: string; answer: string }[] {
  const faqHeading = /\n*##\s+Frequently Asked Questions\s*\n/i;
  const idx = content.search(faqHeading);
  if (idx === -1) return [];

  const faqBlock = content.slice(idx);
  
  const nextHeading = faqBlock.search(/\n##\s+(?!Frequently)/m);
  const block = nextHeading === -1 ? faqBlock : faqBlock.slice(0, nextHeading);

  const entryRegex = /\*\*Q:\s*(.+?)\*\*\s*\n+([\s\S]+?)(?=\n\*\*Q:|$)/g;
  const faqs: { question: string; answer: string }[] = [];
  let match;
  while ((match = entryRegex.exec(block)) !== null) {
    const q = match[1].trim();
    const a = match[2].trim();
    if (q && a) faqs.push({ question: q, answer: a });
  }
  return faqs;
}


function removeFaqFromContent(content: string): string {
  const faqHeading = /\n*##\s+Frequently Asked Questions\s*\n/i;
  const idx = content.search(faqHeading);
  if (idx === -1) return content;

  const contentPart = content.slice(0, idx).trimEnd();
  const faqPart = content.slice(idx);

  
  
  const nextHeadingIdx = faqPart.search(/\n##\s+(?!Frequently Asked Questions)/i);
  if (nextHeadingIdx === -1) {
    return contentPart;
  }

  
  return (contentPart + "\n\n" + faqPart.slice(nextHeadingIdx).trim()).trim();
}


function splitMarkdown(markdown: string) {
  if (!markdown) {
    return { introduction: "", mainContent: "", conclusion: "" };
  }
  
  const lines = markdown.split("\n");
  const h2Indices: number[] = [];
  
  lines.forEach((line, index) => {
    if (line.startsWith("## ")) {
      h2Indices.push(index);
    }
  });

  if (h2Indices.length === 0) {
    return {
      introduction: markdown,
      mainContent: "",
      conclusion: ""
    };
  }

  let introLines: string[] = [];
  let mainLines: string[] = [];
  let conclusionLines: string[] = [];
  
  const firstH2Index = h2Indices[0];
  const introTextBeforeH2 = lines.slice(0, firstH2Index).join("\n").trim();
  
  if (introTextBeforeH2.length > 50) {
    introLines = lines.slice(0, firstH2Index);
    if (h2Indices.length > 1) {
      const lastH2Index = h2Indices[h2Indices.length - 1];
      mainLines = lines.slice(firstH2Index, lastH2Index);
      conclusionLines = lines.slice(lastH2Index);
    } else {
      mainLines = lines.slice(firstH2Index);
    }
  } else {
    if (h2Indices.length > 1) {
      const secondH2Index = h2Indices[1];
      introLines = lines.slice(0, secondH2Index);
      
      if (h2Indices.length > 2) {
        const lastH2Index = h2Indices[h2Indices.length - 1];
        mainLines = lines.slice(secondH2Index, lastH2Index);
        conclusionLines = lines.slice(lastH2Index);
      } else {
        mainLines = lines.slice(secondH2Index);
      }
    } else {
      introLines = lines;
    }
  }

  return {
    introduction: introLines.join("\n").trim(),
    mainContent: mainLines.join("\n").trim(),
    conclusion: conclusionLines.join("\n").trim()
  };
}

interface PageParams {
  params: Promise<{ category: string; slug: string[] }>;
}


export const revalidate = 300;


export async function generateStaticParams() {
  try {
    const slugs = await getAllArticleSlugs();
    return slugs.map(({ category, subcategory, slug }) => ({
      category,
      slug: [subcategory, slug],
    }));
  } catch {
    return [];
  }
}


export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { category, slug } = await params;
  if (!slug || slug.length === 0) {
    return { title: "Redirecting..." };
  }
  if (slug.length === 1) {
    const subcategorySlug = slug[0];
    await connectDB();
    const parentCategory = await Category.findOne({ "subcategories.slug": subcategorySlug }).lean();
    const subcategory = parentCategory?.subcategories?.find((sub: any) => sub.slug === subcategorySlug);
    if (subcategory) {
      return {
        title: `${subcategory.name} Tutorials | Learno-Boy`,
        description: subcategory.description || `Browse high-quality ${subcategory.name} developer articles, tutorials, and best practices.`,
      };
    }
    const article = await Article.findOne({ slug: subcategorySlug, status: "published" }).lean();
    if (article) {
      return { title: article.title };
    }
    return { title: "Article Not Found" };
  }
  const [subcategorySlug, articleSlug] = slug;
  const article = await getArticleBySubcategoryAndSlug(category, subcategorySlug, articleSlug).catch(() => null);
  if (!article) return { title: "Article Not Found" };
  return getArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageParams) {
  const { category: categorySlug, slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  
  if (slug.length === 1) {
    const subcategorySlug = slug[0];
    await connectDB();
    
    const parentCategory = await Category.findOne({ slug: categorySlug }).lean();
    const subcategoryDoc = parentCategory?.subcategories?.find((sub: any) => sub.slug === subcategorySlug);
    
    if (subcategoryDoc) {
      const subcategory = {
        ...subcategoryDoc,
        parent: parentCategory,
        color: parentCategory?.color || "#2563eb",
        icon: parentCategory?.icon || "📚",
      };
      const parentSlug = categorySlug;
      const parentName = parentCategory?.name || categorySlug;
      
      
      if (categorySlug !== parentSlug) {
        redirect(`/${parentSlug}/${subcategorySlug}`);
      }
      
      const paginatedResult = await getArticles({
        category: subcategorySlug,
        limit: 20,
        status: "published",
        sort: "newest"
      }).catch(() => ({ data: [], total: 0 }));
      
      const articles = paginatedResult.data;

      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {}
          <Link
            href={`/${parentSlug}`}
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--link-color)] transition-colors mb-8"
          >
            <ArrowLeft size={16} /> Back to {parentName}
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
              style={{ backgroundColor: subcategory.color || "#2563eb" }}
            />

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {}
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-sm flex-shrink-0"
                style={{
                  background: `${subcategory.color || "#2563eb"}18`,
                  border: `1px solid ${subcategory.color || "#2563eb"}20`,
                  color: subcategory.color || "#2563eb",
                }}
              >
                <CategoryIcon icon={subcategory.icon || "📚"} />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)] mb-2 flex items-center gap-3">
                  {subcategory.name}
                </h1>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed max-w-3xl">
                  {subcategory.description || `High-quality ${subcategory.name} tutorials, concepts, and developer guides.`}
                </p>
                <div className="flex items-center gap-2 mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-tertiary)]">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: subcategory.color || "#2563eb" }}
                  />
                  {paginatedResult.total} {paginatedResult.total === 1 ? "Article" : "Articles"} Available
                </div>
              </div>
            </div>
          </div>

          {}
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
              <BookOpen size={20} style={{ color: subcategory.color || "#2563eb" }} />
              Articles in {subcategory.name}
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
                  We are currently working on articles for this subcategory. Check back soon!
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
      );
    }

    
    const article = await Article.findOne({ slug: subcategorySlug, status: "published" }).lean();
    if (!article) {
      notFound();
    }
    const primaryCategory = article.primaryCategory || "dsa";
    const subcategoryName = article.subcategory || "arrays";
    redirect(`/${primaryCategory}/${subcategoryName}/${subcategorySlug}`);
  }

  
  const [subcategorySlug, articleSlug] = slug;
  const rawArticle = await getArticleBySubcategoryAndSlug(categorySlug, subcategorySlug, articleSlug).catch(() => null);
  if (!rawArticle) notFound();

  
  const article = JSON.parse(JSON.stringify(rawArticle)) as IArticle;

  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;

  const rawRelatedArticles = await getRelatedArticles(
    typeof article.category === "object" ? article.category._id : (article.category as string),
    article.slug,
    4
  ).catch(() => []);
  const relatedArticles = JSON.parse(JSON.stringify(rawRelatedArticles)) as IArticle[];

  const strippedContent = stripFirstH1(article.content);
  
  const articleFaqs = parseFaqsFromContent(strippedContent);
  
  const contentWithoutFaq = removeFaqFromContent(strippedContent);

  const { introduction, mainContent, conclusion } = splitMarkdown(contentWithoutFaq);
  const tocItems = extractTableOfContents(contentWithoutFaq).filter((item) => item.level === 2);
  const jsonLd = getArticleJsonLd(article);
  const tags = article.tags?.filter((t) => typeof t === "object") as ITag[] | undefined;
  
  const seoKeywords: string[] = article.seo?.keywords ?? [];


  
  const breadcrumbLd = getBreadcrumbJsonLd([
    { name: "Home", url: BASE_URL },
    { name: article.primaryCategory.toUpperCase(), url: `${BASE_URL}/${article.primaryCategory}` },
    { name: category ? category.name : subcategorySlug, url: `${BASE_URL}/${article.primaryCategory}/${article.subcategory}` },
    { name: article.title, url: `${BASE_URL}/${article.primaryCategory}/${article.subcategory}/${articleSlug}` },
  ]);

  return (
    <>
      {}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {}
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8 xl:gap-12">
          {}
          <article className="flex-1 min-w-0 max-w-4xl">
            {}
            <ArticleHeader article={article} content={contentWithoutFaq} />

            {/* Cover image — hidden in PDF */}
            {article.coverImage && (
              <div data-hide-print className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            )}

            {}
            <div id="article-body">
              {}
              {introduction && (
                <div className="mb-2">
                  <ArticleBody content={introduction} />
                </div>
              )}

              {}
              {mainContent && (
                <div className="mb-2">
                  <ArticleBody content={mainContent} />
                </div>
              )}

              {}
              {conclusion && (
                <div className="mb-2">
                  <ArticleBody content={conclusion} />
                </div>
              )}
            </div>

            {/* Tags — hidden in PDF print */}
            {seoKeywords.length > 0 ? (
              <div data-hide-print className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[var(--border-color)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-[var(--link-color)] animate-pulse"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mr-1">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {seoKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:border-[var(--link-color)] transition-all hover:scale-105"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ) : tags && tags.length > 0 ? (
              <div data-hide-print className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-[var(--border-color)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4 text-[var(--link-color)] animate-pulse"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
                <span className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mr-1">Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag._id}
                      href={`/tag/${tag.slug}`}
                      className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-surface)] border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--link-color)] hover:border-[var(--link-color)] transition-all hover:scale-105"
                    >
                      #{tag.name.replace(/^#+/, "")}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Mobile TOC — hidden in PDF */}
            {tocItems.length > 0 && (
              <div data-hide-print className="block xl:hidden mt-8">
                <TableOfContents items={tocItems} />
              </div>
            )}

            {/* FAQ, ReadNext, Author, Comments, Metrics, Related — all hidden in PDF */}
            <div data-hide-print>
              <FAQSection faqs={articleFaqs} />

              <ReadNext nextArticle={relatedArticles.length > 0 ? relatedArticles[0] : null} />

              {article.author && (
                <div id="comments-section" className="space-y-6">
                  <AuthorFollowCard
                    author={JSON.parse(JSON.stringify(article.author)) as IAuthor}
                    readingTime={article.readingTime}
                    views={article.views}
                  />
                  <ArticleComments
                    articleId={article._id}
                    author={JSON.parse(JSON.stringify(article.author)) as IAuthor}
                    readingTime={article.readingTime}
                    views={article.views}
                    hideHeader={true}
                    defaultOpen={false}
                  />
                </div>
              )}

              <ArticleMetrics article={article} />

              <RelatedArticles articles={relatedArticles} />
            </div>
          </article>

          {}
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
