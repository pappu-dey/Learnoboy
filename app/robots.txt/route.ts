import { NextResponse } from "next/server";
import { BASE_URL } from "@/lib/utils/seo";

export async function GET() {
  const content = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
