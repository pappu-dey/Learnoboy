import { NextResponse } from "next/server";
import { getAllArticleSlugs } from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";
import { BASE_URL } from "@/lib/utils/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [slugs, categories] = await Promise.all([
      getAllArticleSlugs(),
      getAllCategories(),
    ]);

    const now = new Date().toISOString();

    const staticPages = [
      { url: BASE_URL, lastmod: now, priority: "1.0", changefreq: "daily" },
      {
        url: `${BASE_URL}/search`,
        lastmod: now,
        priority: "0.5",
        changefreq: "monthly",
      },
    ];

    const categoryPages = categories.map((cat) => ({
      url: `${BASE_URL}/${cat.slug}`,
      lastmod: now,
      priority: "0.8",
      changefreq: "weekly",
    }));

    const articlePages = slugs.map(({ category, slug }) => ({
      url: `${BASE_URL}/${category}/${slug}`,
      lastmod: now,
      priority: "0.9",
      changefreq: "monthly",
    }));

    const allPages = [...staticPages, ...categoryPages, ...articlePages];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
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
