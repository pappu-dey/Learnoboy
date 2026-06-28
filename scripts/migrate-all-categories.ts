
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
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

const COMPREHENSIVE_MAPPING: Record<string, string[]> = {
  "javascript": ["javascript-fundamentals", "react", "nextjs", "nodejs", "expressjs"],
  "python": ["numpy", "machine-learning"],
  "data-structures": ["tree", "arrays", "linked-list", "stack", "queue", "graph"],
  "algorithms": ["dynamic-programming", "two-pointers", "sliding-window"],
  "web-development": ["html", "css"],
  "databases": ["sql", "mysql", "mongodb", "postgresql", "dbms"],
};

async function runMigration() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected!");

  let updatedCount = 0;

  for (const [parentSlug, childSlugs] of Object.entries(COMPREHENSIVE_MAPPING)) {
    
    const parentDoc = await Category.findOne({ slug: parentSlug });
    if (!parentDoc) {
      console.warn(`⚠️ Parent category with slug "${parentSlug}" not found. Skipping its children.`);
      continue;
    }

    console.log(`📂 Mapping subcategories under parent: ${parentDoc.name} (${parentSlug})`);

    for (const childSlug of childSlugs) {
      const childDoc = await Category.findOne({ slug: childSlug });
      if (!childDoc) {
        console.warn(`   ⚠️ Subcategory with slug "${childSlug}" not found in database.`);
        continue;
      }

      
      const parentIdStr = String(parentDoc._id);
      const currentParentStr = childDoc.parent ? String(childDoc.parent) : null;

      if (currentParentStr === parentIdStr) {
        console.log(`   ℹ️ "${childDoc.name}" is already linked.`);
      } else {
        childDoc.parent = parentDoc._id;
        
        childDoc.color = parentDoc.color;
        await childDoc.save();
        console.log(`   ✅ Linked "${childDoc.name}" -> "${parentDoc.name}" (Color inherited: ${parentDoc.color})`);
        updatedCount++;
      }
    }
  }

  
  const topLevels = [
    "javascript", "python", "data-structures", "web-development", "databases", "algorithms",
    "c", "cpp", "java", "operating-systems", "computer-networks", "software-engineering", 
    "cyber-law", "professional-ethics", "cyber-security", "interview-preparation", "roadmaps", "projects"
  ];
  
  for (const slug of topLevels) {
    const doc = await Category.findOne({ slug });
    if (doc && doc.parent !== null) {
      doc.parent = null;
      await doc.save();
      console.log(`🧹 Cleaned up top-level category "${doc.name}" parent to null.`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Comprehensive category migration complete! Updated ${updatedCount} documents.`);
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
