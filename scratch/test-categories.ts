import { getAllCategories } from "../lib/services/categoryService";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  const MONGODB_URI = process.env.MONGODB_URI;
  await mongoose.connect(MONGODB_URI!);
  
  try {
    const categories = await getAllCategories();
    console.log(`🔍 Retrieved ${categories.length} categories from service.`);
    
    const topLevels = categories;
    const subCategoriesCount = categories.reduce((sum, c) => sum + (c.subcategories?.length || 0), 0);
    
    console.log(`   - Top-level count: ${topLevels.length}`);
    console.log(`   - Subcategory count: ${subCategoriesCount}`);
    
    if (topLevels.length > 0) {
      console.log("\nTop 5 Top-Level Categories:");
      topLevels.slice(0, 5).forEach(c => {
        console.log(`     * "${c.name}" (slug: ${c.slug}, color: ${c.color})`);
        if (c.subcategories && c.subcategories.length > 0) {
          console.log(`       Subcategories: ${c.subcategories.map(sub => sub.name).join(", ")}`);
        }
      });
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
  }
}

run();
