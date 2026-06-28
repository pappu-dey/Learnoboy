import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Author, Tag } from "@/lib/models";
import { getAllArticleSlugs } from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";
import { BASE_URL } from "@/lib/utils/seo";
import type { ICategory } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    
    await connectDB();

    const [slugs, categories, authors, tags] = await Promise.all([
      getAllArticleSlugs(),
      getAllCategories(),
      Author.find({}).select("slug").lean(),
      Tag.find({}).select("slug").lean(),
    ]);

    const now = new Date().toISOString();

    
    const staticPages = [
      { url: BASE_URL, lastmod: now, priority: "1.0", changefreq: "daily" },
      {
        url: `${BASE_URL}/about`,
        lastmod: now,
        priority: "0.8",
        changefreq: "monthly",
      },
      {
        url: `${BASE_URL}/contact`,
        lastmod: now,
        priority: "0.7",
        changefreq: "monthly",
      },
      {
        url: `${BASE_URL}/search`,
        lastmod: now,
        priority: "0.5",
        changefreq: "monthly",
      },
      {
        url: `${BASE_URL}/donors`,
        lastmod: now,
        priority: "0.6",
        changefreq: "monthly",
      },
      {
        url: `${BASE_URL}/apply`,
        lastmod: now,
        priority: "0.7",
        changefreq: "monthly",
      },
      {
        url: `${BASE_URL}/privacy`,
        lastmod: now,
        priority: "0.3",
        changefreq: "yearly",
      },
      {
        url: `${BASE_URL}/terms`,
        lastmod: now,
        priority: "0.3",
        changefreq: "yearly",
      },
      {
        url: `${BASE_URL}/cookie-policy`,
        lastmod: now,
        priority: "0.3",
        changefreq: "yearly",
      },
      {
        url: `${BASE_URL}/disclaimer`,
        lastmod: now,
        priority: "0.3",
        changefreq: "yearly",
      },
      {
        url: `${BASE_URL}/author`,
        lastmod: now,
        priority: "0.7",
        changefreq: "weekly",
      },
    ];

    
    const categoryPages: { url: string; lastmod: string; priority: string; changefreq: string }[] = [];
    categories.forEach((cat) => {
      categoryPages.push({
        url: `${BASE_URL}/${cat.slug}`,
        lastmod: now,
        priority: "0.85",
        changefreq: "weekly",
      });

      if (Array.isArray(cat.subcategories)) {
        cat.subcategories.forEach((sub) => {
          categoryPages.push({
            url: `${BASE_URL}/${cat.slug}/${sub.slug}`,
            lastmod: now,
            priority: "0.8",
            changefreq: "weekly",
          });
        });
      }
    });

    
    const articlePages = slugs.map(({ category, subcategory, slug }) => ({
      url: `${BASE_URL}/${category}/${subcategory}/${slug}`,
      lastmod: now,
      priority: "0.9",
      changefreq: "monthly",
    }));

    
    const authorPages = authors.map((auth: any) => ({
      url: `${BASE_URL}/author/${auth.slug}`,
      lastmod: now,
      priority: "0.6",
      changefreq: "weekly",
    }));

    
    const tagPages = tags.map((tag: any) => ({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastmod: now,
      priority: "0.5",
      changefreq: "weekly",
    }));

    const allPages = [
      ...staticPages,
      ...categoryPages,
      ...articlePages,
      ...authorPages,
      ...tagPages,
    ];

    
    const seenUrls = new Set<string>();
    const uniquePages = allPages.filter((page) => {
      if (seenUrls.has(page.url)) {
        return false;
      }
      seenUrls.add(page.url);
      return true;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages
  .map(
    (page) => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("[GET /sitemap.xml]", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

