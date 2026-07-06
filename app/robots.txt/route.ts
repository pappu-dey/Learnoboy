import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/utils/seo";

export async function GET() {
  const content = `# =====================================================
# robots.txt — Learno-Boy (https://www.learnoboy.online)
# Generated dynamically at ${new Date().toISOString()}
# =====================================================

# ── All well-behaved crawlers ──────────────────────
User-agent: *
Allow: /

# Protected / private routes — do NOT index
Disallow: /admin/
Disallow: /admin
Disallow: /api/
Disallow: /api
Disallow: /profile/
Disallow: /profile
Disallow: /writer/
Disallow: /writer

# Auth flows — not useful for search engines
Disallow: /login
Disallow: /register
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /verify-email

# Next.js internals
Disallow: /_next/
Disallow: /static/

# Crawl-delay hint (optional — helps avoid overloading the server)
Crawl-delay: 5

# ── Sitemap ────────────────────────────────────────
Sitemap: ${BASE_URL}/sitemap.xml

# ── Google Image Bot ───────────────────────────────
User-agent: Googlebot-Image
Allow: /
Disallow: /admin/
Disallow: /api/

# ── AhrefsBot / SemrushBot (SEO bots) ─────────────
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

# ── Block AI training crawlers ─────────────────────
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Google-Extended
Disallow: /
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
