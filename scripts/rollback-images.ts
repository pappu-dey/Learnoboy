import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import { Article } from "../lib/models";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const restoreMappings = [
  // Article 1
  {
    id: "6a1d10521fad961f85ecdc79",
    cover: null,
    inline: [
      {
        local: "/uploads/article-6a1d10521fad961f85ecdc79/buvbipxtzhs4oxmisiqi-qg479le-original.webp",
        original: "https://res.cloudinary.com/dog19mhla/image/upload/v1780289593/learno-boy/articles/buvbipxtzhs4oxmisiqi.jpg"
      }
    ]
  },
  // Article 2
  {
    id: "6a209ae19835e87c2e34a4a5",
    cover: {
      local: "/uploads/article-6a209ae19835e87c2e34a4a5/cover-svqegpy-original.webp",
      original: "https://res.cloudinary.com/dog19mhla/image/upload/v1780633856/learno-boy/articles/xrmyha0fbsox6yokpq9g.jpg"
    },
    inline: [
      {
        local: "/uploads/article-6a209ae19835e87c2e34a4a5/fnnlb7tsikha0fgipf1l-45327f8-original.webp",
        original: "https://res.cloudinary.com/dog19mhla/image/upload/v1780634533/learno-boy/articles/fnnlb7tsikha0fgipf1l.jpg"
      }
    ]
  },
  // Article 3
  {
    id: "6a27c941847beac0911c8e4d",
    cover: {
      local: "/uploads/article-6a27c941847beac0911c8e4d/cover-72nvtq1-original.webp",
      original: "https://res.cloudinary.com/dog19mhla/image/upload/v1783156211/learno-boy/articles/web-development/html/html-elements-explained-a-beginner-friendly-guide-to-building-web-pages/html-element-cover.jpg"
    },
    inline: []
  },
  // Article 4
  {
    id: "6a3d87f88de2e298fc7887cc",
    cover: {
      local: "/uploads/article-6a3d87f88de2e298fc7887cc/cover-563mu6l-original.webp",
      original: "https://res.cloudinary.com/dog19mhla/image/upload/v1782417011/learno-boy/articles/mxz1qkpceugbvtgx2iwx.jpg"
    },
    inline: []
  },
  // Article 5
  {
    id: "6a426699b1f875c0e98b80f5",
    cover: null,
    inline: [
      {
        local: "/uploads/article-6a426699b1f875c0e98b80f5/hse56xltfnnpp5msn05x-oejz5kk-original.webp",
        original: "https://res.cloudinary.com/dog19mhla/image/upload/v1782738580/learno-boy/articles/hse56xltfnnpp5msn05x.png"
      },
      {
        local: "/uploads/article-6a426699b1f875c0e98b80f5/kaletm2itrcbwmul6xcs-s2vpp0q-original.webp",
        original: "https://res.cloudinary.com/dog19mhla/image/upload/v1782738580/learno-boy/articles/kaletm2itrcbwmul6xcs.jpg"
      },
      {
        local: "/uploads/article-6a426699b1f875c0e98b80f5/efe1dfj5on0zchfppd2c-9s5peaw-original.webp",
        original: "https://res.cloudinary.com/dog19mhla/image/upload/v1782738580/learno-boy/articles/efe1dfj5on0zchfppd2c.png"
      }
    ]
  }
];

async function rollback() {
  console.log("[rollback] 🚀 Starting rollback of local image paths back to Cloudinary...");
  
  await connectDB();
  console.log("[rollback] 🔌 Connected to MongoDB Database");

  let updatedCount = 0;

  for (const mapping of restoreMappings) {
    const article = await Article.findById(mapping.id);
    if (!article) {
      console.warn(`[rollback] ⚠️ Article ${mapping.id} not found.`);
      continue;
    }

    let dirty = false;
    console.log(`[rollback] 🔍 Processing: "${article.title}"`);

    // Restore Cover
    if (mapping.cover && article.coverImage === mapping.cover.local) {
      console.log(`  [cover] Restoring cover to: ${mapping.cover.original}`);
      article.coverImage = mapping.cover.original;
      dirty = true;
    }

    // Restore Inline images in content
    let content = article.content || "";
    for (const img of mapping.inline) {
      if (content.includes(img.local)) {
        console.log(`  [inline] Restoring image path: ${img.local} -> ${img.original}`);
        // Replace the md format: ![alt](local) -> ![alt](original)
        // Since we only replaced the URL inside the parenthesis, we can replace the string literal
        content = content.replaceAll(img.local, img.original);
        dirty = true;
      }
    }

    if (dirty) {
      article.content = content;
      await article.save();
      updatedCount++;
      console.log(`  [article] ✅ Successfully rolled back database record for article ${mapping.id}`);
    } else {
      console.log(`  [article] 👍 No rollback action needed.`);
    }
  }

  console.log(`\n[rollback] 🎉 Rollback finished. Total articles restored: ${updatedCount}`);
  await mongoose.disconnect();
  process.exit(0);
}

rollback().catch((err) => {
  console.error("[rollback] ❌ Rollback failed:", err);
  process.exit(1);
});
