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

    // ─── Static Pages ──────────────────────────────────────────────────────────
    const staticPages = [
      // Home
      { url: BASE_URL,                          lastmod: now, priority: "1.0",  changefreq: "daily"   },

      // Primary info pages
      { url: `${BASE_URL}/about`,               lastmod: now, priority: "0.8",  changefreq: "monthly" },
      { url: `${BASE_URL}/contact`,             lastmod: now, priority: "0.7",  changefreq: "monthly" },
      { url: `${BASE_URL}/search`,              lastmod: now, priority: "0.6",  changefreq: "weekly"  },
      { url: `${BASE_URL}/donors`,              lastmod: now, priority: "0.6",  changefreq: "monthly" },
      { url: `${BASE_URL}/apply`,               lastmod: now, priority: "0.7",  changefreq: "monthly" },

      // Author listing
      { url: `${BASE_URL}/author`,              lastmod: now, priority: "0.7",  changefreq: "weekly"  },

      // Compiler / interactive tools
      { url: `${BASE_URL}/compiler`,            lastmod: now, priority: "0.7",  changefreq: "weekly"  },
      { url: `${BASE_URL}/compiler/html`,       lastmod: now, priority: "0.8",  changefreq: "weekly"  },

      // Tools hub
      { url: `${BASE_URL}/tools`,               lastmod: now, priority: "0.8",  changefreq: "monthly" },
      { url: `${BASE_URL}/tools/calculator`,    lastmod: now, priority: "0.8",  changefreq: "monthly" },

      // Unit converters
      { url: `${BASE_URL}/tools/unitconverters`,           lastmod: now, priority: "0.8",  changefreq: "monthly" },
      { url: `${BASE_URL}/tools/unitconverters/academic`,  lastmod: now, priority: "0.85", changefreq: "monthly" },
      { url: `${BASE_URL}/tools/unitconverters/area`,      lastmod: now, priority: "0.85", changefreq: "monthly" },
      { url: `${BASE_URL}/tools/unitconverters/age`,       lastmod: now, priority: "0.85", changefreq: "monthly" },
      { url: `${BASE_URL}/tools/unitconverters/interest`,  lastmod: now, priority: "0.85", changefreq: "monthly" },

      // Legal / policy pages (lower priority, rarely change)
      { url: `${BASE_URL}/privacy`,             lastmod: now, priority: "0.3",  changefreq: "yearly"  },
      { url: `${BASE_URL}/terms`,               lastmod: now, priority: "0.3",  changefreq: "yearly"  },
      { url: `${BASE_URL}/cookie-policy`,       lastmod: now, priority: "0.3",  changefreq: "yearly"  },
      { url: `${BASE_URL}/disclaimer`,          lastmod: now, priority: "0.3",  changefreq: "yearly"  },
      { url: `${BASE_URL}/editorial-policy`,    lastmod: now, priority: "0.3",  changefreq: "yearly"  },
    ];

    // ─── Category & Sub-category Pages ────────────────────────────────────────
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

    // ─── Article Pages (use real updatedAt as lastmod) ─────────────────────────
    const articlePages = slugs.map(({ category, subcategory, slug, lastmod }) => ({
      url: `${BASE_URL}/${category}/${subcategory}/${slug}`,
      lastmod,
      priority: "0.9",
      changefreq: "monthly",
    }));

    // ─── Author Profile Pages ─────────────────────────────────────────────────
    const authorPages = authors.map((auth: any) => ({
      url: `${BASE_URL}/author/${auth.slug}`,
      lastmod: now,
      priority: "0.6",
      changefreq: "weekly",
    }));

    // ─── Tag Pages ────────────────────────────────────────────────────────────
    const tagPages = tags.map((tag: any) => ({
      url: `${BASE_URL}/tag/${tag.slug}`,
      lastmod: now,
      priority: "0.5",
      changefreq: "weekly",
    }));

    // ─── Merge & Deduplicate ──────────────────────────────────────────────────
    const allPages = [
      ...staticPages,
      ...categoryPages,
      ...articlePages,
      ...authorPages,
      ...tagPages,
    ];

    const seenUrls = new Set<string>();
    const uniquePages = allPages.filter((page) => {
      if (seenUrls.has(page.url)) return false;
      seenUrls.add(page.url);
      return true;
    });

    // ─── Render XML ───────────────────────────────────────────────────────────
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
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
        "Content-Type": "application/xml; charset=utf-8",
        // Cache for 1 hour; bust with revalidatePath("/sitemap.xml") on every publish
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=60",
      },
    });
  } catch (error) {
    console.error("[GET /sitemap.xml]", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
