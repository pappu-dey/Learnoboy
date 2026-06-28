

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

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);


const JS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><rect width="32" height="32" rx="4" fill="#f7df1e"/><path d="M9.5 24.5c.6 1 1.4 1.7 2.8 1.7 1.6 0 2.6-.8 2.6-2.3V14h-2.3v9.8c0 .7-.3 1-.8 1-.5 0-.8-.3-1.1-.8l-1.2 1.5zm7.8-.4c.7 1.2 1.8 2 3.6 2 1.9 0 3.3-1 3.3-2.7 0-1.6-.9-2.3-2.6-3.1l-.6-.3c-.9-.4-1.3-.7-1.3-1.3 0-.5.4-.9 1-.9.6 0 1 .3 1.4.9l1.6-1c-.7-1.2-1.7-1.7-3-1.7-1.8 0-3 1.1-3 2.7 0 1.6.9 2.4 2.4 3.1l.6.3c1 .5 1.5.8 1.5 1.5 0 .6-.5 1-1.3 1-.9 0-1.5-.5-1.9-1.3l-1.7 1z" fill="#323330"/></svg>`;

const PYTHON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="pyTop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5a9fd4"/><stop offset="100%" stop-color="#306998"/></linearGradient><linearGradient id="pyBot" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd43b"/><stop offset="100%" stop-color="#ffe873"/></linearGradient></defs><path d="M15.9 3C11.3 3 11.6 5 11.6 5v4.1h4.5v1.3H8.6S6 10 6 14.7s2.2 4.5 2.2 4.5H10v-2.2s-.1-2.2 2.2-2.2h6.8s2.1.03 2.1-2V7.1S21.5 3 15.9 3zm-1.3 1.8c.7 0 1.2.6 1.2 1.2 0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z" fill="url(#pyTop)"/><path d="M16.1 29c4.6 0 4.3-2 4.3-2v-4.1h-4.5v-1.3h7.5s2.6.4 2.6-4.3-2.2-4.5-2.2-4.5H22v2.2s.1 2.2-2.2 2.2h-6.8s-2.1-.03-2.1 2v4.8S10.5 29 16.1 29zm1.3-1.8c-.7 0-1.2-.6-1.2-1.2 0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2-.5 1.2-1.2 1.2z" fill="url(#pyBot)"/></svg>`;

const DS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="5" r="3" fill="#8b5cf6"/><circle cx="7" cy="16" r="3" fill="#8b5cf6"/><circle cx="25" cy="16" r="3" fill="#8b5cf6"/><circle cx="4" cy="27" r="3" fill="#8b5cf6"/><circle cx="12" cy="27" r="3" fill="#8b5cf6"/><circle cx="20" cy="27" r="3" fill="#8b5cf6"/><circle cx="28" cy="27" r="3" fill="#8b5cf6"/><line x1="16" y1="8" x2="7" y2="13" stroke="#8b5cf6" stroke-width="1.5"/><line x1="16" y1="8" x2="25" y2="13" stroke="#8b5cf6" stroke-width="1.5"/><line x1="7" y1="19" x2="4" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="7" y1="19" x2="12" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="25" y1="19" x2="20" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="25" y1="19" x2="28" y2="24" stroke="#8b5cf6" stroke-width="1.5"/></svg>`;

const WEB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><rect x="2" y="4" width="28" height="20" rx="2" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="2" y1="10" x2="30" y2="10" stroke="#2563eb" stroke-width="2"/><circle cx="6" cy="7" r="1" fill="#ef4444"/><circle cx="10" cy="7" r="1" fill="#f59e0b"/><circle cx="14" cy="7" r="1" fill="#22c55e"/><path d="M7 15h8M7 19h5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/><rect x="18" y="14" width="9" height="7" rx="1" fill="#2563eb" opacity="0.2" stroke="#2563eb" stroke-width="1.5"/><line x1="11" y1="24" x2="11" y2="28" stroke="#2563eb" stroke-width="2"/><line x1="6" y1="28" x2="16" y2="28" stroke="#2563eb" stroke-width="2"/></svg>`;

const DB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><ellipse cx="16" cy="8" rx="11" ry="4" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 8v5c0 2.2 5 4 11 4s11-1.8 11-4V8" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 13v5c0 2.2 5 4 11 4s11-1.8 11-4v-5" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 18v5c0 2.2 5 4 11 4s11-1.8 11-4v-5" fill="none" stroke="#ef4444" stroke-width="2"/><ellipse cx="16" cy="8" rx="11" ry="4" fill="#ef444418"/></svg>`;

const ALGO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="16" r="6" fill="none" stroke="#14b8a6" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="8" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="24" x2="16" y2="30" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="16" x2="8" y2="16" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="16" x2="30" y2="16" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="5.8" y1="5.8" x2="10.1" y2="10.1" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="21.9" y1="21.9" x2="26.2" y2="26.2" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="26.2" y1="5.8" x2="21.9" y2="10.1" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="10.1" y1="21.9" x2="5.8" y2="26.2" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="2.5" fill="#14b8a6"/></svg>`;

const ICON_MAP: Record<string, string> = {
  javascript: JS_ICON,
  python: PYTHON_ICON,
  "data-structures": DS_ICON,
  "web-development": WEB_ICON,
  databases: DB_ICON,
  algorithms: ALGO_ICON,
};

async function updateIcons() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected!");

    let updated = 0;
    for (const [slug, svgIcon] of Object.entries(ICON_MAP)) {
      const result = await Category.findOneAndUpdate(
        { slug },
        { $set: { icon: svgIcon } },
        { returnDocument: "after" }
      );
      if (result) {
        console.log(`✅ Updated icon for: ${result.name}`);
        updated++;
      } else {
        console.log(`⚠️  Category not found: ${slug}`);
      }
    }

    console.log(`\n🎉 Done! Updated ${updated} category icons.`);
  } catch (err) {
    console.error("❌ Update failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

updateIcons();
