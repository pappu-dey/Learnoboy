import connectDB from "../lib/mongodb";
import { Article } from "../lib/models";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function run() {
  await connectDB();
  console.log("🔍 Checking with Article.findOne...");
  
  const slug = "understanding-binary-trees-visual-guide";
  const article = await Article.findOne({ slug, status: "published" }).lean();
  console.log("Result:", article);
  
  if (article) {
    console.log("Success! Found article title:", article.title);
  } else {
    console.log("Error: Article NOT found! Checking without status filter...");
    const rawArticle = await Article.findOne({ slug }).lean();
    console.log("Result without status:", rawArticle);
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error in test-query:", err);
    process.exit(1);
  });
