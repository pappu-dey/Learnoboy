/**
 * Seed script: populates the database with sample data.
 * Run with: npx ts-node --esm scripts/seed.ts
 * Or add to package.json: "seed": "tsx scripts/seed.ts"
 *
 * Make sure your .env.local has a valid MONGODB_URI before running.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load env from project root
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ---- Inline schemas (to avoid TS path alias issues in scripts) ----
const AuthorSchema = new mongoose.Schema({
  name: String,
  slug: String,
  bio: String,
  avatar: String,
  email: String,
  social: { twitter: String, github: String },
  articleCount: { type: Number, default: 0 },
}, { timestamps: true });

const CategorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
  icon: String,
  color: String,
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

// ---- Seed data ----
const JS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><rect width="32" height="32" rx="4" fill="#f7df1e"/><path d="M9.5 24.5c.6 1 1.4 1.7 2.8 1.7 1.6 0 2.6-.8 2.6-2.3V14h-2.3v9.8c0 .7-.3 1-.8 1-.5 0-.8-.3-1.1-.8l-1.2 1.5zm7.8-.4c.7 1.2 1.8 2 3.6 2 1.9 0 3.3-1 3.3-2.7 0-1.6-.9-2.3-2.6-3.1l-.6-.3c-.9-.4-1.3-.7-1.3-1.3 0-.5.4-.9 1-.9.6 0 1 .3 1.4.9l1.6-1c-.7-1.2-1.7-1.7-3-1.7-1.8 0-3 1.1-3 2.7 0 1.6.9 2.4 2.4 3.1l.6.3c1 .5 1.5.8 1.5 1.5 0 .6-.5 1-1.3 1-.9 0-1.5-.5-1.9-1.3l-1.7 1z" fill="#323330"/></svg>`;

const PYTHON_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="pyTop" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#5a9fd4"/><stop offset="100%" stop-color="#306998"/></linearGradient><linearGradient id="pyBot" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ffd43b"/><stop offset="100%" stop-color="#ffe873"/></linearGradient></defs><path d="M15.9 3C11.3 3 11.6 5 11.6 5v4.1h4.5v1.3H8.6S6 10 6 14.7s2.2 4.5 2.2 4.5H10v-2.2s-.1-2.2 2.2-2.2h6.8s2.1.03 2.1-2V7.1S21.5 3 15.9 3zm-1.3 1.8c.7 0 1.2.6 1.2 1.2 0 .7-.5 1.2-1.2 1.2s-1.2-.5-1.2-1.2.5-1.2 1.2-1.2z" fill="url(#pyTop)"/><path d="M16.1 29c4.6 0 4.3-2 4.3-2v-4.1h-4.5v-1.3h7.5s2.6.4 2.6-4.3-2.2-4.5-2.2-4.5H22v2.2s.1 2.2-2.2 2.2h-6.8s-2.1-.03-2.1 2v4.8S10.5 29 16.1 29zm1.3-1.8c-.7 0-1.2-.6-1.2-1.2 0-.7.5-1.2 1.2-1.2s1.2.5 1.2 1.2-.5 1.2-1.2 1.2z" fill="url(#pyBot)"/></svg>`;

const DS_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="5" r="3" fill="#8b5cf6"/><circle cx="7" cy="16" r="3" fill="#8b5cf6"/><circle cx="25" cy="16" r="3" fill="#8b5cf6"/><circle cx="4" cy="27" r="3" fill="#8b5cf6"/><circle cx="12" cy="27" r="3" fill="#8b5cf6"/><circle cx="20" cy="27" r="3" fill="#8b5cf6"/><circle cx="28" cy="27" r="3" fill="#8b5cf6"/><line x1="16" y1="8" x2="7" y2="13" stroke="#8b5cf6" stroke-width="1.5"/><line x1="16" y1="8" x2="25" y2="13" stroke="#8b5cf6" stroke-width="1.5"/><line x1="7" y1="19" x2="4" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="7" y1="19" x2="12" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="25" y1="19" x2="20" y2="24" stroke="#8b5cf6" stroke-width="1.5"/><line x1="25" y1="19" x2="28" y2="24" stroke="#8b5cf6" stroke-width="1.5"/></svg>`;

const WEB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><rect x="2" y="4" width="28" height="20" rx="2" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="2" y1="10" x2="30" y2="10" stroke="#2563eb" stroke-width="2"/><circle cx="6" cy="7" r="1" fill="#ef4444"/><circle cx="10" cy="7" r="1" fill="#f59e0b"/><circle cx="14" cy="7" r="1" fill="#22c55e"/><path d="M7 15h8M7 19h5" stroke="#2563eb" stroke-width="1.5" stroke-linecap="round"/><rect x="18" y="14" width="9" height="7" rx="1" fill="#2563eb" opacity="0.2" stroke="#2563eb" stroke-width="1.5"/><line x1="11" y1="24" x2="11" y2="28" stroke="#2563eb" stroke-width="2"/><line x1="6" y1="28" x2="16" y2="28" stroke="#2563eb" stroke-width="2"/></svg>`;

const DB_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><ellipse cx="16" cy="8" rx="11" ry="4" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 8v5c0 2.2 5 4 11 4s11-1.8 11-4V8" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 13v5c0 2.2 5 4 11 4s11-1.8 11-4v-5" fill="none" stroke="#ef4444" stroke-width="2"/><path d="M5 18v5c0 2.2 5 4 11 4s11-1.8 11-4v-5" fill="none" stroke="#ef4444" stroke-width="2"/><ellipse cx="16" cy="8" rx="11" ry="4" fill="#ef444418"/></svg>`;

const ALGO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="16" r="6" fill="none" stroke="#14b8a6" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="8" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="24" x2="16" y2="30" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="16" x2="8" y2="16" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="24" y1="16" x2="30" y2="16" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="5.8" y1="5.8" x2="10.1" y2="10.1" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="21.9" y1="21.9" x2="26.2" y2="26.2" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="26.2" y1="5.8" x2="21.9" y2="10.1" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><line x1="10.1" y1="21.9" x2="5.8" y2="26.2" stroke="#14b8a6" stroke-width="2" stroke-linecap="round"/><circle cx="16" cy="16" r="2.5" fill="#14b8a6"/></svg>`;

const CATEGORIES = [
  { name: "JavaScript", slug: "javascript", description: "Modern JavaScript tutorials and guides.", icon: JS_ICON, color: "#f59e0b" },
  { name: "Python", slug: "python", description: "Python programming from beginner to advanced.", icon: PYTHON_ICON, color: "#10b981" },
  { name: "Data Structures", slug: "data-structures", description: "DSA concepts, problems, and patterns.", icon: DS_ICON, color: "#8b5cf6" },
  { name: "Web Development", slug: "web-development", description: "HTML, CSS, and modern web technologies.", icon: WEB_ICON, color: "#2563eb" },
  { name: "Databases", slug: "databases", description: "SQL, NoSQL, MongoDB, and database design.", icon: DB_ICON, color: "#ef4444" },
  { name: "Algorithms", slug: "algorithms", description: "Sorting, searching, dynamic programming.", icon: ALGO_ICON, color: "#14b8a6" },
];

const TAGS = [
  { name: "Beginner", slug: "beginner" },
  { name: "Advanced", slug: "advanced" },
  { name: "Tutorial", slug: "tutorial" },
  { name: "Interview Prep", slug: "interview-prep" },
  { name: "Best Practices", slug: "best-practices" },
];

const AUTHORS = [
  {
    name: "Alex Kumar",
    slug: "alex-kumar",
    bio: "Senior software engineer with 10 years of experience. Loves teaching complex topics simply.",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=alex",
    email: "alex@learnoboy.dev",
    social: { twitter: "alexkumar", github: "alexkumar" },
  },
  {
    name: "Priya Sharma",
    slug: "priya-sharma",
    bio: "Full-stack developer and technical writer. Specializes in JavaScript and React.",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=priya",
    email: "priya@learnoboy.dev",
    social: { github: "priyasharma" },
  },
];

const ARTICLE_CONTENT = `## Introduction

JavaScript is one of the most popular programming languages in the world. Whether you're building websites, mobile apps, or server-side applications, JavaScript is everywhere.

In this tutorial, we'll explore the fundamentals of JavaScript and how to get started.

## Variables and Data Types

JavaScript has several ways to declare variables:

\`\`\`javascript
// Modern way (ES6+)
let name = "Alice";        // Can be reassigned
const PI = 3.14159;        // Cannot be reassigned
var oldStyle = "legacy";   // Avoid using var

// Data types
let string = "Hello, World!";
let number = 42;
let boolean = true;
let nothing = null;
let notDefined = undefined;
let obj = { key: "value" };
let arr = [1, 2, 3];
\`\`\`

## Functions

Functions are first-class citizens in JavaScript:

\`\`\`javascript
// Function declaration
function greet(name) {
  return \`Hello, \${name}!\`;
}

// Arrow function (ES6+)
const greet = (name) => \`Hello, \${name}!\`;

// Async function
async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
\`\`\`

## Arrays and Objects

Working with data structures in JavaScript:

\`\`\`javascript
// Array methods
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(n => n * 2);
const evens = numbers.filter(n => n % 2 === 0);
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Object destructuring
const { name, age, ...rest } = user;

// Spread operator
const newArray = [...arr1, ...arr2];
const newObj = { ...obj1, ...obj2 };
\`\`\`

## Promises and Async/Await

Modern JavaScript handles asynchronous code elegantly:

\`\`\`javascript
// Promise chain
fetch('/api/data')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));

// Async/Await (cleaner syntax)
async function getData() {
  try {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

## Conclusion

JavaScript is a powerful and versatile language. By mastering its fundamentals, you'll be ready to build modern web applications and dive deeper into frameworks like React, Vue, or Node.js.

> **Pro Tip:** Practice daily coding challenges on platforms like LeetCode to reinforce your JavaScript skills!

## Further Reading

- [MDN Web Docs — JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [You Don't Know JS](https://github.com/getify/You-Dont-Know-JS)
- [JavaScript.info](https://javascript.info)
`;

async function seed() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected!");

    // Clear existing data
    await Promise.all([
      Author.deleteMany({}),
      Category.deleteMany({}),
      Tag.deleteMany({}),
      Article.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // Insert categories
    const insertedCategories = await Category.insertMany(CATEGORIES);
    console.log(`✅ Inserted ${insertedCategories.length} categories`);

    // Insert tags
    const insertedTags = await Tag.insertMany(TAGS);
    console.log(`✅ Inserted ${insertedTags.length} tags`);

    // Insert authors
    const insertedAuthors = await Author.insertMany(AUTHORS);
    console.log(`✅ Inserted ${insertedAuthors.length} authors`);

    // Insert sample articles
    const jsCategory = insertedCategories.find((c) => c.slug === "javascript");
    const pyCategory = insertedCategories.find((c) => c.slug === "python");
    const dsCategory = insertedCategories.find((c) => c.slug === "data-structures");

    const articles = [
      {
        title: "JavaScript Fundamentals: A Complete Beginner's Guide",
        slug: "javascript-fundamentals-complete-beginners-guide",
        category: jsCategory?._id,
        author: insertedAuthors[0]._id,
        tags: [insertedTags[0]._id, insertedTags[2]._id],
        content: ARTICLE_CONTENT,
        excerpt: "Learn the core concepts of JavaScript including variables, functions, arrays, objects, and async programming with practical examples.",
        coverImage: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&q=80",
        readingTime: 8,
        isFeatured: true,
        status: "published",
        views: 12543,
        publishedAt: new Date("2024-01-15"),
        seo: {
          metaTitle: "JavaScript Fundamentals: A Complete Beginner's Guide | LearnoBoy",
          metaDescription: "Learn JavaScript from scratch. Covers variables, functions, arrays, objects, and async/await with practical code examples.",
        },
      },
      {
        title: "Python for Data Science: Getting Started with NumPy",
        slug: "python-data-science-numpy-guide",
        category: pyCategory?._id,
        author: insertedAuthors[1]._id,
        tags: [insertedTags[0]._id, insertedTags[2]._id],
        content: ARTICLE_CONTENT.replace(/JavaScript/g, "Python").replace(/javascript/g, "python"),
        excerpt: "Explore NumPy, the fundamental package for scientific computing in Python. Learn arrays, operations, and data manipulation.",
        coverImage: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80",
        readingTime: 10,
        isFeatured: true,
        status: "published",
        views: 9876,
        publishedAt: new Date("2024-01-20"),
        seo: {
          metaTitle: "Python for Data Science: Getting Started with NumPy | LearnoBoy",
          metaDescription: "A beginner-friendly guide to NumPy for data science. Learn arrays, broadcasting, and mathematical operations.",
        },
      },
      {
        title: "Understanding Binary Trees: A Visual Guide",
        slug: "understanding-binary-trees-visual-guide",
        category: dsCategory?._id,
        author: insertedAuthors[0]._id,
        tags: [insertedTags[3]._id, insertedTags[4]._id],
        content: ARTICLE_CONTENT.replace(/JavaScript/g, "Binary Trees").replace(/javascript/g, "trees"),
        excerpt: "Master binary trees with visual explanations, code examples, and common interview problems. From traversal to balanced BSTs.",
        coverImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80",
        readingTime: 12,
        isFeatured: true,
        status: "published",
        views: 7654,
        publishedAt: new Date("2024-02-01"),
        seo: {
          metaTitle: "Understanding Binary Trees: A Visual Guide | LearnoBoy",
          metaDescription: "Visual guide to binary trees. Covers tree traversal, BST operations, and common interview problems with code examples.",
        },
      },
      {
        title: "React Hooks Deep Dive: useState, useEffect, and Custom Hooks",
        slug: "react-hooks-deep-dive-usestate-useeffect-custom-hooks",
        category: jsCategory?._id,
        author: insertedAuthors[1]._id,
        tags: [insertedTags[1]._id, insertedTags[4]._id],
        content: ARTICLE_CONTENT,
        excerpt: "Master React Hooks with a comprehensive deep dive into useState, useEffect, useRef, and how to build powerful custom hooks.",
        coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80",
        readingTime: 15,
        isFeatured: false,
        status: "published",
        views: 5432,
        publishedAt: new Date("2024-02-10"),
        seo: {
          metaTitle: "React Hooks Deep Dive | LearnoBoy",
          metaDescription: "Comprehensive guide to React Hooks. Learn useState, useEffect, useRef, and how to create custom hooks.",
        },
      },
      {
        title: "Dynamic Programming: Mastering the Core Patterns",
        slug: "dynamic-programming-mastering-core-patterns",
        category: dsCategory?._id,
        author: insertedAuthors[0]._id,
        tags: [insertedTags[1]._id, insertedTags[3]._id],
        content: ARTICLE_CONTENT.replace(/JavaScript/g, "Dynamic Programming").replace(/javascript/g, "dp"),
        excerpt: "Learn dynamic programming from scratch. Master memoization, tabulation, and the 5 essential DP patterns that solve 90% of interview problems.",
        coverImage: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&q=80",
        readingTime: 18,
        isFeatured: false,
        status: "published",
        views: 11234,
        publishedAt: new Date("2024-02-15"),
        seo: {
          metaTitle: "Dynamic Programming: Mastering Core Patterns | LearnoBoy",
          metaDescription: "Master dynamic programming with memoization, tabulation, and 5 essential patterns with 20+ example problems.",
        },
      },
    ];

    await Article.insertMany(articles);
    console.log(`✅ Inserted ${articles.length} articles`);

    // Update article counts on categories
    for (const cat of insertedCategories) {
      const count = articles.filter(
        (a) => a.category?.toString() === cat._id.toString()
      ).length;
      await Category.findByIdAndUpdate(cat._id, { articleCount: count });
    }
    console.log("✅ Updated category article counts");

    // Update author article counts
    for (const author of insertedAuthors) {
      const count = articles.filter(
        (a) => a.author?.toString() === author._id.toString()
      ).length;
      await Author.findByIdAndUpdate(author._id, { articleCount: count });
    }
    console.log("✅ Updated author article counts");

    console.log("\n🎉 Seed complete! Your database is ready.");
    console.log("👉 Run: npm run dev");
    console.log("🌐 Visit: http://localhost:3000");
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
