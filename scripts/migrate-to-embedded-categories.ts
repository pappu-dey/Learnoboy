
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
  subcategories: [
    {
      name: String,
      slug: String,
      description: String,
      articleCount: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true, strict: false });

const ArticleSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: mongoose.Schema.Types.ObjectId,
  categories: [mongoose.Schema.Types.ObjectId],
  primaryCategory: String,
  subcategory: String,
}, { timestamps: true, strict: false });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

async function runMigration() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI!);
  console.log("✅ Connected!");

  
  const allCategories = await Category.find({});
  console.log(`📊 Found ${allCategories.length} category documents in total.`);

  
  const parentCats = allCategories.filter(c => !c.parent);
  const subCats = allCategories.filter(c => c.parent);

  console.log(`📁 Parent Categories: ${parentCats.length}`);
  console.log(`🏷️ Subcategories to migrate: ${subCats.length}`);

  
  const subcatToParentMap: Record<string, any> = {};

  
  for (const parent of parentCats) {
    const parentIdStr = String(parent._id);
    const children = subCats.filter(c => String(c.parent) === parentIdStr);
    
    console.log(`🔹 Migrating subcategories for "${parent.name}" (${parent.slug}):`);
    
    
    parent.subcategories = [];

    for (const child of children) {
      subcatToParentMap[String(child._id)] = parent;
      
      parent.subcategories.push({
        _id: child._id,
        name: child.name,
        slug: child.slug,
        description: child.description || "",
        articleCount: child.articleCount || 0,
        createdAt: child.createdAt,
        updatedAt: child.updatedAt,
      });
      console.log(`   🔗 Embedded subcategory: "${child.name}" (Slug: ${child.slug})`);
    }

    
    
    parent.set("parent", undefined);
    await parent.save();
    console.log(`   💾 Saved parent category: "${parent.name}"`);
  }

  
  console.log("\n📝 Updating articles category references...");
  const articles = await Article.find({});
  let updatedArticlesCount = 0;

  for (const art of articles) {
    const catIdStr = String(art.category);
    const parentDoc = subcatToParentMap[catIdStr];

    if (parentDoc) {
      
      
      art.category = parentDoc._id;
      art.categories = [parentDoc._id];
      
      
      
      const oldSubcatDoc = subCats.find(c => String(c._id) === catIdStr);
      if (oldSubcatDoc) {
        art.primaryCategory = parentDoc.slug;
        art.subcategory = oldSubcatDoc.slug;
      }

      await art.save();
      console.log(`   🔄 Updated Article "${art.title}" -> Parent Category: "${parentDoc.name}"`);
      updatedArticlesCount++;
    } else {
      
      const isParent = parentCats.some(p => String(p._id) === catIdStr);
      if (isParent && (!art.categories || art.categories.length === 0)) {
        art.categories = [art.category];
        await art.save();
        updatedArticlesCount++;
      }
    }
  }
  console.log(`✅ Updated ${updatedArticlesCount} articles.`);

  
  console.log("\n🗑️ Cleaning up flat subcategory documents...");
  const deleteIds = subCats.map(c => c._id);
  if (deleteIds.length > 0) {
    const deleteResult = await Category.deleteMany({ _id: { $in: deleteIds } });
    console.log(`✅ Deleted ${deleteResult.deletedCount} flat subcategory documents.`);
  } else {
    console.log("ℹ️ No flat subcategory documents to delete.");
  }

  
  console.log("\n🔢 Recalculating article counts...");
  const finalParents = await Category.find({});
  for (const parent of finalParents) {
    
    const totalCount = await Article.countDocuments({ category: parent._id });
    parent.articleCount = totalCount;

    
    if (parent.subcategories && parent.subcategories.length > 0) {
      for (const sub of parent.subcategories) {
        const subCount = await Article.countDocuments({
          category: parent._id,
          subcategory: sub.slug
        });
        sub.articleCount = subCount;
      }
    }

    await parent.save();
    console.log(`📈 Updated counts for parent "${parent.name}": Total=${parent.articleCount}`);
  }

  console.log("\n🎉 Database categories migration completed successfully!");
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
