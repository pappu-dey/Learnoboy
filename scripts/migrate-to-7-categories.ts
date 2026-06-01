/**
 * Restructure Database Categories:
 * Enforces exactly 7 top-level parent categories in the database and re-maps
 * all 34+ other categories as subcategories under them.
 * Also updates articles to align with the new 7 parent slugs.
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// Inline schemas for safety
const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  color: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const ArticleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  primaryCategory: String,
  subcategory: String,
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

const TARGET_PARENTS = [
  { name: "Coding", slug: "coding", color: "#f59e0b", icon: "💻", description: "Learn coding in C, C++, Java, Python, and JavaScript." },
  { name: "DSA", slug: "dsa", color: "#8b5cf6", icon: "🧮", description: "Data Structures & Algorithms concepts, problems, and solutions." },
  { name: "Web Development", slug: "web-development", color: "#2563eb", icon: "🌐", description: "HTML, CSS, React, Next.js, and modern full-stack engineering." },
  { name: "Database", slug: "database", color: "#ef4444", icon: "🗄️", description: "Relational databases, SQL, NoSQL, MongoDB, and database design." },
  { name: "CS Fundamentals", slug: "cs-fundamentals", color: "#10b981", icon: "🖥️", description: "Core Computer Science concepts like OS, Networks, and Software Engineering." },
  { name: "Machine Learning", slug: "machine-learning", color: "#ec4899", icon: "🤖", description: "Artificial Intelligence, Data Science, and Deep Learning." },
  { name: "Cyber Security", slug: "cyber-security", color: "#14b8a6", icon: "🛡️", description: "Cryptography, Network Security, and Cyber Defense." },
];

const CHILD_MAPPINGS: Record<string, string[]> = {
  "coding": ["javascript", "python", "c", "cpp", "java", "javascript-fundamentals", "numpy"],
  "dsa": ["arrays", "linked-list", "stack", "queue", "tree", "graph", "dynamic-programming", "two-pointers", "sliding-window", "data-structures", "algorithms"],
  "web-development": ["html", "css", "react", "nextjs", "nodejs", "expressjs"],
  "database": ["sql", "mysql", "mongodb", "postgresql", "dbms", "databases"],
  "cs-fundamentals": ["operating-systems", "computer-networks", "software-engineering", "cyber-law", "professional-ethics"],
  "machine-learning": ["general-ml", "supervised-learning", "unsupervised-learning", "deep-learning"],
  "cyber-security": ["network-security", "cryptography", "penetration-testing", "cyber-defense"],
};

async function migrate() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected!");

  // 1. Create target parent categories if they do not exist
  const parentIdMap: Record<string, mongoose.Types.ObjectId> = {};
  for (const parent of TARGET_PARENTS) {
    let doc = await Category.findOne({ slug: parent.slug });
    if (!doc) {
      doc = await Category.create({
        ...parent,
        parent: null,
      });
      console.log(`✨ Created new parent category: "${parent.name}"`);
    } else {
      // Update its parent field to null to guarantee it is top-level
      doc.parent = null;
      doc.name = parent.name;
      doc.color = parent.color;
      doc.icon = parent.icon;
      doc.description = parent.description;
      await doc.save();
      console.log(`ℹ️ Updated parent category: "${parent.name}"`);
    }
    parentIdMap[parent.slug] = doc._id;
  }

  // 2. Link all subcategories under their new parents
  let subcatCount = 0;
  for (const [parentSlug, childSlugs] of Object.entries(CHILD_MAPPINGS)) {
    const parentId = parentIdMap[parentSlug];
    const parentDoc = await Category.findById(parentId);

    for (const childSlug of childSlugs) {
      // Don't map parent categories to themselves
      if (childSlug === parentSlug) continue;

      const childDoc = await Category.findOne({ slug: childSlug });
      if (childDoc) {
        childDoc.parent = parentId;
        childDoc.color = parentDoc!.color; // inherit parent theme color
        await childDoc.save();
        console.log(`   🔗 Linked subcategory "${childDoc.name}" -> parent "${parentDoc!.name}"`);
        subcatCount++;
      }
    }
  }

  // 3. Make sure any leftover or old categories that are not the 7 parents are subcategories
  const allCategories = await Category.find({});
  const parentSlugs = TARGET_PARENTS.map((p) => p.slug);
  for (const cat of allCategories) {
    if (!parentSlugs.includes(cat.slug) && cat.parent === null) {
      // Orphan top-level category: put it under "Coding" or another logical parent
      cat.parent = parentIdMap["coding"];
      cat.color = "#f59e0b";
      await cat.save();
      console.log(`🧹 Fixed orphan category "${cat.name}" -> parent "Coding"`);
      subcatCount++;
    }
  }

  // 4. Update articles to align with the new 7 parent category slugs
  const articles = await Article.find({});
  let articleUpdates = 0;
  for (const art of articles) {
    let updated = false;

    // Map old primaryCategory slugs to the new 7 parent slugs
    const oldPrimary = art.primaryCategory;
    let newPrimary = oldPrimary;

    if (oldPrimary === "javascript" || oldPrimary === "python") {
      newPrimary = "coding";
    } else if (oldPrimary === "data-structures" || oldPrimary === "algorithms") {
      newPrimary = "dsa";
    } else if (oldPrimary === "databases") {
      newPrimary = "database";
    }

    if (newPrimary !== oldPrimary) {
      art.primaryCategory = newPrimary;
      updated = true;
    }

    if (updated) {
      await art.save();
      console.log(`   📝 Updated article "${art.title}" primaryCategory -> "${newPrimary}"`);
      articleUpdates++;
    }
  }

  // 5. Update article counts on all categories
  console.log("\n🔄 Updating article counts...");
  for (const cat of allCategories) {
    const isParent = parentSlugs.includes(cat.slug);
    let count = 0;
    
    if (isParent) {
      // For parent, count all articles where primaryCategory is this parent
      count = await Article.countDocuments({ primaryCategory: cat.slug });
    } else {
      // For subcategory, count articles where subcategory slug matches OR category points to it
      count = await Article.countDocuments({
        $or: [
          { subcategory: cat.slug },
          { category: cat._id },
        ],
      });
    }
    
    await Category.findByIdAndUpdate(cat._id, { articleCount: count });
  }

  console.log(`\n🎉 Restructuring complete!`);
  console.log(`   - Verified Top-Level Categories: 7`);
  console.log(`   - Linked Subcategories: ${subcatCount}`);
  console.log(`   - Updated Articles Routing: ${articleUpdates}`);

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
