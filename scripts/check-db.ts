
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const ArticleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  status: String,
  isFeatured: Boolean,
  publishedAt: Date,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String, slug: String, icon: String,
}, { timestamps: true });

const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function check() {
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected");

  const allArticles = await Article.find({}).lean();
  console.log(`\n📄 Total articles: ${allArticles.length}`);
  for (const a of allArticles) {
    const art = a as { title: string; status: string; isFeatured: boolean; publishedAt: Date };
    console.log(`  - "${art.title}" | status: ${art.status} | featured: ${art.isFeatured} | publishedAt: ${art.publishedAt}`);
  }

  const publishedArticles = await Article.find({ status: "published" }).lean();
  console.log(`\n✅ Published articles: ${publishedArticles.length}`);

  const featuredArticles = await Article.find({ status: "published", isFeatured: true }).lean();
  console.log(`⭐ Featured + published: ${featuredArticles.length}`);

  const allCategories = await Category.find({}).lean();
  console.log(`\n📂 Total categories: ${allCategories.length}`);
  for (const c of allCategories) {
    const cat = c as { name: string; slug: string; icon: string };
    const iconPreview = cat.icon.substring(0, 40).replace(/\n/g, "");
    console.log(`  - "${cat.name}" (${cat.slug}) | icon starts with: ${iconPreview}...`);
  }

  await mongoose.disconnect();
}

check().catch((e) => { console.error(e); process.exit(1); });
