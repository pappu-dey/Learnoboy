import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  subcategories: [
    {
      name: String,
      slug: String,
    }
  ]
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);

async function check() {
  await mongoose.connect(MONGODB_URI!, { dbName: "learno-boy" });
  const allCats = await Category.find({}).lean();
  for (const cat of allCats) {
    const subs = cat.subcategories ? (cat.subcategories as any[]).map(s => s.slug).join(", ") : "none";
    console.log(`Parent: ${cat.name} (${cat.slug}) -> Subs: [${subs}]`);
  }
  await mongoose.disconnect();
}

check().catch(console.error);
