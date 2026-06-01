import type { Metadata } from "next";
import type { IArticle, ICategory } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME || "Learno-Boy";
const SITE_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
  "A premium educational platform for developers and students.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

export { BASE_URL, SITE_NAME, SITE_DESCRIPTION };

/**
 * Default metadata for the site
 */
export function getDefaultMetadata(): Metadata {
  return {
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: BASE_URL,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      images: [DEFAULT_OG_IMAGE],
    },
    alternates: {
      canonical: BASE_URL,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Generate metadata for an article page
 */
export function getArticleMetadata(article: IArticle): Metadata {
  const category =
    typeof article.category === "object" ? article.category : null;
  const author = typeof article.author === "object" ? article.author : null;

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.excerpt;
  const ogImage = article.seo?.ogImage || article.coverImage || DEFAULT_OG_IMAGE;
  const canonicalUrl =
    article.seo?.canonicalUrl ||
    (article.primaryCategory && article.subcategory
      ? `${BASE_URL}/${article.primaryCategory}/${article.subcategory}/${article.slug}`
      : `${BASE_URL}/${category?.slug || "articles"}/${article.slug}`);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: author ? [author.name] : [],
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

/**
 * Generate metadata for a category page
 */
export function getCategoryMetadata(category: ICategory): Metadata {
  const title = `${category.name} Articles`;
  const description =
    category.description ||
    `Browse all ${category.name} articles on ${SITE_NAME}`;
  const canonicalUrl = `${BASE_URL}/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

/**
 * Generate Article JSON-LD structured data
 */
export function getArticleJsonLd(article: IArticle): object {
  const category =
    typeof article.category === "object" ? article.category : null;
  const author = typeof article.author === "object" ? article.author : null;

  const canonicalUrl =
    article.seo?.canonicalUrl ||
    (article.primaryCategory && article.subcategory
      ? `${BASE_URL}/${article.primaryCategory}/${article.subcategory}/${article.slug}`
      : `${BASE_URL}/${category?.slug || "articles"}/${article.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: author
      ? {
          "@type": "Person",
          name: author.name,
          url: `${BASE_URL}/author/${author.slug}`,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
      },
    },
    image: article.coverImage || DEFAULT_OG_IMAGE,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };
}

/**
 * Generate BreadcrumbList JSON-LD
 */
export function getBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
