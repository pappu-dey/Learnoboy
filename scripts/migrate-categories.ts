/**
 * One-time category migration script:
 * Links existing subcategory documents to their parent top-level category documents using the parent field.
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

// Inline schema for safety
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

const PARENT_CHILD_MAPPING: Record<string, string[]> = {
  "javascript": ["javascript-fundamentals", "react"],
  "python": ["numpy"],
  "data-structures": ["tree", "dynamic-programming"],
};

async function runMigration() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected!");

  let updatedCount = 0;

  for (const [parentSlug, childSlugs] of Object.entries(PARENT_CHILD_MAPPING)) {
    // Find parent category
    const parentDoc = await Category.findOne({ slug: parentSlug });
    if (!parentDoc) {
      console.warn(`⚠️ Parent category with slug "${parentSlug}" not found. Skipping its children.`);
      continue;
    }

    console.log(`📂 Processing subcategories for parent: ${parentDoc.name} (${parentSlug})`);

    for (const childSlug of childSlugs) {
      const childDoc = await Category.findOne({ slug: childSlug });
      if (!childDoc) {
        console.warn(`   ⚠️ Child category with slug "${childSlug}" not found in database.`);
        continue;
      }

      // Update the parent field
      if (childDoc.parent && String(childDoc.parent) === String(parentDoc._id)) {
        console.log(`   ℹ️ "${childDoc.name}" is already linked to "${parentDoc.name}".`);
      } else {
        childDoc.parent = parentDoc._id;
        await childDoc.save();
        console.log(`   ✅ Linked "${childDoc.name}" -> "${parentDoc.name}"`);
        updatedCount++;
      }
    }
  }

  // Also clean up top-level categories to ensure their parent field is null if not set
  const topLevels = ["javascript", "python", "data-structures", "web-development", "databases", "algorithms"];
  for (const slug of topLevels) {
    const doc = await Category.findOne({ slug });
    if (doc && doc.parent !== null) {
      doc.parent = null;
      await doc.save();
      console.log(`🧹 Reset parent of top-level category "${doc.name}" to null.`);
      updatedCount++;
    }
  }

  console.log(`\n🎉 Category migration complete! Updated ${updatedCount} documents.`);
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
