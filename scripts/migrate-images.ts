import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import { Article, Upload } from "../lib/models";
import { optimizeImage } from "../lib/utils/imageOptimizer";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

async function downloadImage(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download image from ${url}. Status: ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function migrate() {
  console.log("[migration] 🚀 Starting image optimization migration...");
  
  // Establish connection
  await connectDB();
  console.log("[migration] 🔌 Connected to MongoDB Database");

  // Retrieve all articles
  const articles = await Article.find();
  console.log(`[migration] 📚 Found ${articles.length} articles to check.`);

  let totalUpdatedArticles = 0;
  let totalOptimizedImages = 0;

  for (const article of articles) {
    let articleDirty = false;
    const articleId = String(article._id);
    const targetDir = `uploads/article-${articleId}`;

    console.log(`\n[migration] 🔍 Checking article: "${article.title}" (${articleId})`);

    // 1. Check and migrate cover image
    if (article.coverImage && article.coverImage.includes("res.cloudinary.com")) {
      console.log(`  [cover] Found Cloudinary cover image: ${article.coverImage}`);
      try {
        const buffer = await downloadImage(article.coverImage);
        const originalName = path.basename(new URL(article.coverImage).pathname) || "cover.jpg";

        const optimizedResult = await optimizeImage(
          buffer,
          originalName,
          targetDir,
          "cover"
        );

        // Save Upload metadata
        const uploadRec = await Upload.create({
          originalFilename: originalName,
          optimizedFilename: optimizedResult.optimizedFilename,
          filePath: optimizedResult.filePath,
          width: optimizedResult.width,
          height: optimizedResult.height,
          mimeType: optimizedResult.mimeType,
          fileSize: optimizedResult.fileSize,
          altText: `${article.title} cover`,
          blurPlaceholder: optimizedResult.blurPlaceholder,
          responsiveSizes: optimizedResult.responsiveSizes,
          articleId,
        });

        const newUrl = `${optimizedResult.filePath}/${optimizedResult.optimizedFilename}`;
        console.log(`  [cover] ✅ Cover image optimized and saved to ${newUrl}`);

        article.coverImage = newUrl;
        articleDirty = true;
        totalOptimizedImages++;
      } catch (err: any) {
        console.error(`  [cover] ❌ Failed to migrate cover image for article ${articleId}:`, err.message);
      }
    }

    // 2. Check and migrate inline markdown images
    // Regex matches markdown images: ![alt](url)
    const imgRegex = /!\[(.*?)\]\((https:\/\/res\.cloudinary\.com\/.*?)\)/g;
    let content = article.content || "";
    let match;
    const matchesToProcess: { alt: string; url: string; rawMatch: string }[] = [];

    // Find all matches first
    while ((match = imgRegex.exec(content)) !== null) {
      matchesToProcess.push({
        alt: match[1],
        url: match[2],
        rawMatch: match[0],
      });
    }

    if (matchesToProcess.length > 0) {
      console.log(`  [content] Found ${matchesToProcess.length} inline Cloudinary images.`);
      
      for (const item of matchesToProcess) {
        console.log(`  [inline] Migrating: ${item.url}`);
        try {
          const buffer = await downloadImage(item.url);
          const originalName = path.basename(new URL(item.url).pathname) || "image.jpg";

          const optimizedResult = await optimizeImage(
            buffer,
            originalName,
            targetDir
          );

          // Save Upload metadata
          await Upload.create({
            originalFilename: originalName,
            optimizedFilename: optimizedResult.optimizedFilename,
            filePath: optimizedResult.filePath,
            width: optimizedResult.width,
            height: optimizedResult.height,
            mimeType: optimizedResult.mimeType,
            fileSize: optimizedResult.fileSize,
            altText: item.alt || originalName.replace(/\.[^.]+$/, ""),
            blurPlaceholder: optimizedResult.blurPlaceholder,
            responsiveSizes: optimizedResult.responsiveSizes,
            articleId,
          });

          const newUrl = `${optimizedResult.filePath}/${optimizedResult.optimizedFilename}`;
          console.log(`  [inline] ✅ Inline image optimized and saved to ${newUrl}`);

          // Replace URL in content
          const newMd = `![${item.alt}](${newUrl})`;
          content = content.replace(item.rawMatch, newMd);
          articleDirty = true;
          totalOptimizedImages++;
        } catch (err: any) {
          console.error(`  [inline] ❌ Failed to migrate inline image ${item.url}:`, err.message);
        }
      }
    }

    if (articleDirty) {
      article.content = content;
      await article.save();
      totalUpdatedArticles++;
      console.log(`  [article] 💾 Saved changes to database for article ${articleId}`);
    } else {
      console.log(`  [article] 👍 No changes needed.`);
    }
  }

  console.log("\n[migration] 🎉 Migration finished successfully!");
  console.log(`[migration] 📝 Total articles updated: ${totalUpdatedArticles}`);
  console.log(`[migration] 🖼️ Total images optimized: ${totalOptimizedImages}`);
  
  await mongoose.disconnect();
  console.log("[migration] 🔌 Disconnected from database.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("[migration] ❌ Fatal migration failure:", err);
  process.exit(1);
});
