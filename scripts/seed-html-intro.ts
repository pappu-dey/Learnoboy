/**
 * Seed script for HTML Introduction article
 * Run with: npx tsx scripts/seed-html-intro.ts
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

// Inline schemas for safety in scripts
const AuthorSchema = new mongoose.Schema({
  name: String,
  slug: String,
  bio: String,
  avatar: String,
  email: String,
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  color: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const TagSchema = new mongoose.Schema({
  name: String,
  slug: String,
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
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  content: String,
  excerpt: String,
  coverImage: String,
  readingTime: Number,
  isFeatured: Boolean,
  status: { type: String, default: "published" },
  views: { type: Number, default: 0 },
  publishedAt: Date,
  seo: { metaTitle: String, metaDescription: String },
}, { timestamps: true });

const Author = mongoose.models.Author || mongoose.model("Author", AuthorSchema);
const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);
const Article = mongoose.models.Article || mongoose.model("Article", ArticleSchema);

const HTML_CONTENT = `## What is HTML?

**HTML** stands for **HyperText Markup Language**. It is the standard markup language used to create the structure of web pages. Unlike programming languages (which handle logic, algorithms, and computations), HTML is a markup language that defines how content is styled, grouped, and rendered in a web browser.

HTML consists of a series of **elements**, represented by **tags**, which tell the browser how to display the content. For example, tags can label pieces of content as "this is a heading," "this is a paragraph," or "this is a link."

---

## Basic HTML Document Structure

Every standard HTML5 document follows a specific skeletal layout. Below is a classic example of a simple HTML document:

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First HTML Page</title>
</head>
<body>
    <h1>Welcome to Learno-Boy!</h1>
    <p>HTML is the foundation of modern web design.</p>
</body>
</html>
\`\`\`

### Explanation of Elements:
- \`<!DOCTYPE html>\`: Defines that this document is an HTML5 document.
- \`<html lang="enflip">\`: The root element of an HTML page, specifying English as the main language.
- \`<head>\`: Contains meta-information about the HTML page (such as SEO meta tags, title, stylesheets, and scripts).
- \`<title>\`: Specifies a title for the HTML page, displayed in the browser's title bar or tab.
- \`<body>\`: Defines the document's body, and is a container for all the visible contents, such as headings, paragraphs, images, hyperlinks, tables, lists, etc.
- \`<h1>\`: Defines a large heading.
- \`<p>\`: Defines a paragraph.

---

## Anatomical Structure of an HTML Element

An HTML element is usually defined by a **start tag**, some **content**, and an **end tag**:

![HTML Element Structure](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80)

Here is a breakdown of \`<p>Web Development is fun!</p>\`:
1. **Start Tag (\`<p>\`)**: Tells the browser where the element begins.
2. **Content ("Web Development is fun!")**: The actual text or nested elements to display.
3. **End Tag (\`</p>\`)**: Tells the browser where the element ends. Note the forward slash (\`/\`).

### Nested Elements
HTML elements can be nested inside other elements. For example, to make a word **bold** inside a paragraph:

\`\`\`html
<p>HTML is <strong>extremely</strong> easy to learn.</p>
\`\`\`

---

## Key HTML Elements You Must Know

Here are the absolute essentials for building web page structures:

### 1. Headings (\`<h1>\` to \`<h6>\`)
Headings range from \`<h1>\` (most important) to \`<h6>\` (least important):
\`\`\`html
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
\`\`\`

### 2. Links (\`<a>\`)
Hyperlinks are created using the anchor tag \`<a>\`. The \`href\` attribute specifies the destination URL:
\`\`\`html
<a href="https://learnoboy.dev" target="_blank">Visit Learno-Boy</a>
\`\`\`

### 3. Images (\`<img>\`)
Images are self-closing (empty) tags. They require \`src\` (source path) and \`alt\` (alternative text for accessibility) attributes:
\`\`\`html
<img src="html-logo.png" alt="HTML5 Logo Official" width="100" />
\`\`\`

### 4. Lists (\`<ul>\`, \`<ol>\`, \`<li>\`)
Unordered (bulleted) and ordered (numbered) lists:
\`\`\`html
<!-- Unordered List -->
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>

<!-- Ordered List -->
<ol>
  <li>Plan your structure</li>
  <li>Write the markup</li>
  <li>Style with CSS</li>
</ol>
\`\`\`

---

## Modern HTML5 Best Practices

To write professional, clean, and search-engine-friendly HTML, follow these rules:

1. **Always Use Semantic Tags**: Instead of styling everything with \`<div>\` and \`<span>\`, use modern semantic tags like \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, and \`<footer>\`. This vastly improves SEO and accessibility.
2. **Always Include the \`alt\` Attribute on Images**: This is vital for visually impaired users using screen readers and ensures search engine bots can understand your media.
3. **Lowercase Tag Names**: While HTML tags are case-insensitive, the W3C standard and industry convention strongly recommend lowercase tags (\`<body>\` instead of \`<BODY>\`).
4. **Always Close Your Elements**: Forgetting to close tags like \`</p>\` or \`</div>\` can completely break your layout.

> **HTML is not a mystery.** It is a markup system designed to be simple, structured, and read by browsers worldwide. In the next tutorial, we will learn about CSS to start styling our structure!
`;

async function seed() {
  try {
    console.log("🔗 Connecting to MongoDB Atlas cluster...");
    await mongoose.connect(MONGODB_URI!, { dbName: "learno-boy" });
    console.log("✅ Connected!");

    // Find "web-development" (parent category) and "html" (subcategory)
    const webDevCategory = await Category.findOne({ slug: "web-development" });
    let htmlCategory = await Category.findOne({ slug: "html" });

    if (!webDevCategory) {
      console.error("❌ Parent category 'web-development' not found! Make sure to run migrate-to-7-categories first.");
      process.exit(1);
    }

    if (!htmlCategory) {
      console.log("✨ 'html' subcategory not found. Creating it...");
      htmlCategory = await Category.create({
        name: "HTML",
        slug: "html",
        description: "HyperText Markup Language guides and references.",
        icon: `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
        color: "#e34c26",
        parent: webDevCategory._id,
      });
    }

    // Find default author by slug, or create it safely
    let author = await Author.findOne({ slug: "ikka-dey" });
    if (!author) {
      console.log("👤 Creating a default author 'Ikka Dey'...");
      author = await Author.create({
        name: "Ikka Dey",
        slug: "ikka-dey",
        bio: "Senior Technical Writer & Full-stack Web Developer passionate about frontend engineering and accessibility.",
        avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=IkkaDey",
        email: "ikka@learnoboy.dev",
        articleCount: 1,
      });
    } else {
      // Force update fields safely
      author.name = "Ikka Dey";
      author.avatar = "https://api.dicebear.com/8.x/avataaars/svg?seed=IkkaDey";
      await author.save();
    }

    // Find or create tags "Beginner" and "Web Dev"
    let beginnerTag = await Tag.findOne({ slug: "beginner" });
    if (!beginnerTag) {
      beginnerTag = await Tag.create({ name: "Beginner", slug: "beginner" });
    }
    let htmlTag = await Tag.findOne({ slug: "html" });
    if (!htmlTag) {
      htmlTag = await Tag.create({ name: "HTML", slug: "html" });
    }

    // Seed "HTML Introduction" article with exact Date "2026-04-20"
    const articleData = {
      title: "HTML Introduction",
      slug: "html-introduction",
      primaryCategory: "web-development",
      subcategory: "html",
      difficulty: "Beginner",
      contentType: "Tutorial",
      category: htmlCategory._id,
      categories: [htmlCategory._id],
      author: author._id,
      tags: [beginnerTag._id, htmlTag._id],
      content: HTML_CONTENT,
      excerpt: "Get started with web development by mastering the fundamentals of HTML, its basic structure, essential elements, and standard best practices.",
      coverImage: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=1200&q=80",
      readingTime: 10,
      isFeatured: true,
      status: "published",
      views: 10034,
      publishedAt: new Date("2026-04-20T10:00:00.000Z"), // Set publishedAt to April 20, 2026
      seo: {
        metaTitle: "HTML Introduction: Learn Web Structure from Scratch | LearnoBoy",
        metaDescription: "Master HTML basics, elements, semantic structure, and standard coding best practices with our comprehensive beginner-friendly tutorial.",
      },
    };

    // Upsert the article by slug
    const updatedArticle = await Article.findOneAndUpdate(
      { slug: "html-introduction" },
      articleData,
      { upsert: true, new: true }
    );

    console.log(`✅ Seeded/Updated Article: "${updatedArticle.title}" (slug: ${updatedArticle.slug})`);
    console.log(`📅 Published At: ${updatedArticle.publishedAt}`);

    // Update article counts
    const count = await Article.countDocuments({
      $or: [{ subcategory: "html" }, { category: htmlCategory._id }],
    });
    await Category.findByIdAndUpdate(htmlCategory._id, { articleCount: count });
    console.log(`📂 Updated 'html' category count to ${count}`);

    const authorCount = await Article.countDocuments({ author: author._id });
    await Author.findByIdAndUpdate(author._id, { articleCount: authorCount });
    console.log(`👤 Updated author article count to ${authorCount}`);

    console.log("\n🎉 HTML Introduction seeding complete!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
