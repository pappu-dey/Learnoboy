
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}


const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  color: String,
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  primaryCategory: String,
  subcategory: String,
  difficulty: String,
  contentType: String,
  status: String,
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

async function resolveSubcategoryDoc(primaryCategory: string, subcategoryName: string): Promise<string> {
  const slug = slugify(subcategoryName);
  let cat = await Category.findOne({ slug });
  if (!cat) {
    cat = await Category.create({
      name: subcategoryName,
      slug,
      description: `${subcategoryName} subcategory under ${primaryCategory}`,
      icon: "📚",
      color: "#3b82f6",
    });
  }
  return String(cat._id);
}

const ARTICLE_MAPPINGS: Record<string, { primaryCategory: string; subcategory: string; subcategoryName: string; difficulty: string; contentType: string }> = {
  "javascript-fundamentals-complete-beginners-guide": {
    primaryCategory: "javascript",
    subcategory: "javascript-fundamentals",
    subcategoryName: "JavaScript Fundamentals",
    difficulty: "Beginner",
    contentType: "Tutorial"
  },
  "python-data-science-numpy-guide": {
    primaryCategory: "python",
    subcategory: "numpy",
    subcategoryName: "NumPy",
    difficulty: "Beginner",
    contentType: "Tutorial"
  },
  "understanding-binary-trees-visual-guide": {
    primaryCategory: "data-structures",
    subcategory: "tree",
    subcategoryName: "Tree",
    difficulty: "Intermediate",
    contentType: "Tutorial"
  },
  "react-hooks-deep-dive-usestate-useeffect-custom-hooks": {
    primaryCategory: "javascript",
    subcategory: "react",
    subcategoryName: "React",
    difficulty: "Intermediate",
    contentType: "Tutorial"
  },
  "dynamic-programming-mastering-core-patterns": {
    primaryCategory: "data-structures",
    subcategory: "dynamic-programming",
    subcategoryName: "Dynamic Programming",
    difficulty: "Advanced",
    contentType: "Tutorial"
  }
};

async function migrate() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected!");

  const articles = await Article.find({
    $or: [
      { primaryCategory: { $exists: false } },
      { primaryCategory: null },
      { subcategory: { $exists: false } },
      { subcategory: null }
    ]
  });

  console.log(`📄 Found ${articles.length} articles needing migration.`);

  let migratedCount = 0;
  for (const art of articles) {
    const slug = art.slug;
    const mapping = ARTICLE_MAPPINGS[slug];
    if (mapping) {
      console.log(`🔨 Migrating "${art.title}" (slug: ${slug})...`);
      const subcatId = await resolveSubcategoryDoc(mapping.primaryCategory, mapping.subcategoryName);
      
      art.primaryCategory = mapping.primaryCategory;
      art.subcategory = mapping.subcategory;
      art.difficulty = mapping.difficulty;
      art.contentType = mapping.contentType;
      art.category = new mongoose.Types.ObjectId(subcatId);
      art.categories = [new mongoose.Types.ObjectId(subcatId)];
      
      await art.save();
      console.log(`✅ Successfully migrated "${art.title}"`);
      migratedCount++;
    } else {
      console.warn(`⚠️ No mapping found for article: "${art.title}" (slug: ${slug}). Skipping.`);
    }
  }

  console.log(`\n🎉 Migration complete! Migrated ${migratedCount} articles.`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
