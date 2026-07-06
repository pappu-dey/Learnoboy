import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { GET } from "../app/sitemap.xml/route";

async function test() {
  const res = await GET();
  const xml = await res.text();
  console.log(xml);
}

test().catch(console.error);
