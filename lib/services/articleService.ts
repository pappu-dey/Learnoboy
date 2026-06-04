import connectDB from "@/lib/mongodb";
// Import all models together to ensure they're all registered before populate() runs
import { Article, Category, Author, Tag } from "@/lib/models";
import type { IArticle, PaginatedResponse } from "@/types";
import { slugify } from "@/lib/utils/slugify";

export interface GetArticlesOptions {
  page?: number;
  limit?: number;
  category?: string; // category slug
  tag?: string; // tag slug
  status?: "draft" | "published";
  featured?: boolean;
  sort?: "newest" | "oldest" | "popular";
  authorId?: string; // filter by author _id
}

/**
 * Get paginated list of articles
 */
export async function getArticles(
  options: GetArticlesOptions = {}
): Promise<PaginatedResponse<IArticle>> {
  await connectDB();

  const {
    page = 1,
    limit = 10,
    status = "published",
    featured,
    sort = "newest",
  } = options;

  const skip = (page - 1) * limit;

  // Build filter
  const filter: Record<string, unknown> = { status };
  if (featured !== undefined) filter.isFeatured = featured;

  if (options.category) {
    const categoryDoc = await Category.findOne({ slug: options.category });
    if (categoryDoc) {
      if (!categoryDoc.parent) {
        // This is a parent category (e.g. dsa, coding, web-development, database, more)
        const subcategories = await Category.find({ parent: categoryDoc._id }).select("_id").lean();
        const subcategoryIds = subcategories.map(s => s._id);
        filter.$or = [
          { primaryCategory: options.category.toLowerCase() },
          { category: categoryDoc._id },
          { category: { $in: subcategoryIds } },
          { categories: categoryDoc._id },
          { categories: { $in: subcategoryIds } }
        ];
      } else {
        // This is a subcategory (e.g. tree, numpy)
        filter.$or = [
          { subcategory: options.category.toLowerCase() },
          { category: categoryDoc._id },
          { categories: categoryDoc._id }
        ];
      }
    } else {
      // Fallback
      filter.$or = [
        { primaryCategory: options.category.toLowerCase() },
        { subcategory: options.category.toLowerCase() }
      ];
    }
  }

  if (options.tag) {
    const tSlug = options.tag.toLowerCase();
    if (tSlug === "beginner" || tSlug === "intermediate" || tSlug === "advanced") {
      filter.difficulty = options.tag.charAt(0).toUpperCase() + options.tag.slice(1);
    } else if (["tutorial", "interview-prep", "best-practices", "roadmap", "project", "cheat-sheet", "notes"].includes(tSlug)) {
      const map: Record<string, string> = {
        "tutorial": "Tutorial",
        "interview-prep": "Interview Prep",
        "best-practices": "Best Practices",
        "roadmap": "Roadmap",
        "project": "Project",
        "cheat-sheet": "Cheat Sheet",
        "notes": "Notes"
      };
      filter.contentType = map[tSlug] || "Tutorial";
    } else {
      const tagDoc = await Tag.findOne({ slug: options.tag });
      if (tagDoc) {
        filter.tags = tagDoc._id;
      } else {
        return {
          data: [],
          total: 0,
          page,
          limit,
          totalPages: 0,
        };
      }
    }
  }

  if (options.authorId) {
    filter.author = options.authorId;
  }

  // Build sort
  const sortMap = {
    newest: { publishedAt: -1 },
    oldest: { publishedAt: 1 },
    popular: { views: -1 },
  } as const;

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .populate("category", "name slug icon color")
      .populate("categories", "name slug icon color")
      .populate("author", "name slug avatar isVerified")
      .populate("tags", "name slug")
      .sort(sortMap[sort])
      .skip(skip)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ]);

  const injectedArticles = articles.map(art => injectAutoTags(art));

  return {
    data: injectedArticles as unknown as IArticle[],
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get a single article by slug (with category slug for URL matching)
 */
export async function getArticleBySlug(
  categorySlug: string,
  articleSlug: string
): Promise<IArticle | null> {
  await connectDB();

  const article = await Article.findOne({ slug: articleSlug, status: "published" })
    .populate("category", "name slug icon color description")
    .populate("categories", "name slug icon color")
    .populate("author", "name slug avatar bio social isVerified expertise location totalViews articleCount")
    .populate("tags", "name slug")
    .lean();

  if (!article) return null;

  const populated = article as unknown as IArticle;
  
  // Check primary category
  const primaryCategory =
    typeof populated.category === "object" ? populated.category : null;
  let hasMatchingCategory = primaryCategory && primaryCategory.slug === categorySlug;

  // Check extra categories
  if (!hasMatchingCategory && Array.isArray(populated.categories)) {
    for (const cat of populated.categories) {
      if (typeof cat === "object" && cat && cat.slug === categorySlug) {
        hasMatchingCategory = true;
        break;
      }
    }
  }

  if (!hasMatchingCategory) return null;

  // Increment view count (fire and forget)
  Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec();

  return populated;
}

/**
 * Get article by ID
 */
export async function getArticleById(id: string): Promise<IArticle | null> {
  await connectDB();
  const article = await Article.findById(id)
    .populate("category", "name slug icon color")
    .populate("categories", "name slug icon color")
    .populate("author", "name slug avatar bio isVerified")
    .populate("tags", "name slug")
    .lean();

  return injectAutoTags(article) as unknown as IArticle | null;
}

/**
 * Get related articles (same category, excluding current)
 */
export async function getRelatedArticles(
  categoryId: string,
  currentSlug: string,
  limit = 4
): Promise<IArticle[]> {
  await connectDB();
  const articles = await Article.find({
    category: categoryId,
    slug: { $ne: currentSlug },
    status: "published",
  })
    .populate("category", "name slug")
    .populate("author", "name slug avatar")
    .select("title slug excerpt coverImage readingTime publishedAt category author primaryCategory subcategory difficulty contentType")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  const injectedArticles = articles.map(art => injectAutoTags(art));

  return injectedArticles as unknown as IArticle[];
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(limit = 3): Promise<IArticle[]> {
  await connectDB();
  const articles = await Article.find({ isFeatured: true, status: "published" })
    .populate("category", "name slug icon color")
    .populate("author", "name slug avatar isVerified")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return articles as unknown as IArticle[];
}

/**
 * Get latest articles
 */
export async function getLatestArticles(limit = 8): Promise<IArticle[]> {
  await connectDB();
  const articles = await Article.find({ status: "published" })
    .populate("category", "name slug icon color")
    .populate("author", "name slug avatar isVerified")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return articles as unknown as IArticle[];
}

export async function processKeywords(keywords: string): Promise<string[]> {
  const keywordList = keywords
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0);

  const tagIds: string[] = [];
  for (const keyword of keywordList) {
    const slug = slugify(keyword);
    if (!slug) continue;

    // Find or create tag
    let tag = await Tag.findOne({ slug });
    if (!tag) {
      tag = await Tag.create({
        name: keyword,
        slug,
        articleCount: 0,
      });
    }
    tagIds.push(String(tag._id));
  }
  return tagIds;
}

export async function resolveSubcategoryDoc(primaryCategory: string, subcategoryName: string): Promise<string> {
  const slug = slugify(subcategoryName);
  let cat = await Category.findOne({ slug });
  
  // Find the parent category
  const parentCat = await Category.findOne({ slug: primaryCategory.toLowerCase() });

  if (!cat) {
    cat = await Category.create({
      name: subcategoryName,
      slug,
      description: `${subcategoryName} subcategory under ${primaryCategory}`,
      icon: "📚",
      color: parentCat ? parentCat.color : "#3b82f6",
      parent: parentCat ? parentCat._id : null,
    });
  } else if (!cat.parent && parentCat) {
    cat.parent = parentCat._id;
    await (cat as any).save();
  }
  return String(cat._id);
}

export function injectAutoTags(article: any) {
  if (!article) return article;

  const difficulty = article.difficulty || "Beginner";
  const contentType = article.contentType || "Tutorial";

  const diffTag = {
    _id: `diff-${difficulty.toLowerCase()}`,
    name: `#${difficulty}`,
    slug: difficulty.toLowerCase(),
    articleCount: 0
  };

  const typeTagName = `#${contentType.replace(/\s+/g, "")}`;
  const typeTagSlug = contentType.toLowerCase().replace(/\s+/g, "-");

  const typeTag = {
    _id: `type-${typeTagSlug}`,
    name: typeTagName,
    slug: typeTagSlug,
    articleCount: 0
  };

  return {
    ...article,
    tags: [diffTag, typeTag]
  };
}

export async function getArticleBySubcategoryAndSlug(
  primaryCategory: string,
  subcategory: string,
  articleSlug: string
): Promise<IArticle | null> {
  await connectDB();
  const article = await Article.findOne({
    slug: articleSlug,
    primaryCategory: primaryCategory.toLowerCase(),
    subcategory: subcategory.toLowerCase(),
    status: "published",
  })
    .populate("category", "name slug icon color description")
    .populate("categories", "name slug icon color")
    .populate("author", "name slug avatar bio social isVerified expertise location totalViews articleCount")
    .populate("tags", "name slug")
    .lean();

  if (!article) return null;

  // Increment view count
  Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec();

  return injectAutoTags(article) as unknown as IArticle;
}

/**
 * Create a new article
 */
export async function createArticle(data: Partial<IArticle>): Promise<IArticle> {
  await connectDB();

  // If subcategory is selected, we resolve its ObjectID ref to a flat Category document
  if (data.primaryCategory && data.subcategory) {
    const subcategoryName = data.subcategory.charAt(0).toUpperCase() + data.subcategory.slice(1);
    const subcatId = await resolveSubcategoryDoc(data.primaryCategory, subcategoryName);
    data.category = subcatId;
    data.categories = [subcatId];
  }

  // Handle manual keywords if passed (save inside seo.keywords)
  if (data.keywords !== undefined) {
    const keywordList = data.keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
    data.seo = {
      ...data.seo,
      metaTitle: data.seo?.metaTitle || data.title,
      metaDescription: data.seo?.metaDescription || data.excerpt,
      keywords: keywordList
    };
  }

  // Keep `category` in sync with first item of `categories` for URL routing
  if (Array.isArray(data.categories) && data.categories.length > 0 && !data.category) {
    (data as Record<string, unknown>).category = data.categories[0];
  }
  const article = new Article(data);
  await article.save();
  return article.toObject() as unknown as IArticle;
}

/**
 * Update article by ID
 */
export async function updateArticle(
  id: string,
  data: Partial<IArticle>
): Promise<IArticle | null> {
  await connectDB();

  // If subcategory is selected, we resolve its ObjectID ref to a flat Category document
  if (data.primaryCategory && data.subcategory) {
    const subcategoryName = data.subcategory.charAt(0).toUpperCase() + data.subcategory.slice(1);
    const subcatId = await resolveSubcategoryDoc(data.primaryCategory, subcategoryName);
    data.category = subcatId;
    data.categories = [subcatId];
  }

  // Handle manual keywords if passed (save inside seo.keywords)
  if (data.keywords !== undefined) {
    const keywordList = data.keywords.split(",").map(k => k.trim()).filter(k => k.length > 0);
    data.seo = {
      ...data.seo,
      metaTitle: data.seo?.metaTitle || data.title,
      metaDescription: data.seo?.metaDescription || data.excerpt,
      keywords: keywordList
    };
  }

  // Keep `category` in sync with first item of `categories` for URL routing
  if (Array.isArray(data.categories) && data.categories.length > 0) {
    (data as Record<string, unknown>).category = data.categories[0];
  }
  const article = await Article.findByIdAndUpdate(id, data, { new: true })
    .populate("category", "name slug")
    .populate("categories", "name slug icon color")
    .populate("author", "name slug avatar")
    .populate("tags", "name slug")
    .lean();

  return injectAutoTags(article) as unknown as IArticle | null;
}

/**
 * Delete article by ID
 */
export async function deleteArticle(id: string): Promise<IArticle | null> {
  await connectDB();
  const result = await Article.findByIdAndDelete(id).lean();
  return result as unknown as IArticle | null;
}

/**
 * Get all slugs for static generation
 */
export async function getAllArticleSlugs(): Promise<
  { category: string; subcategory: string; slug: string }[]
> {
  await connectDB();
  const articles = await Article.find({ status: "published" })
    .select("slug primaryCategory subcategory")
    .lean();

  return articles.map((a: any) => {
    return {
      category: a.primaryCategory || "dsa",
      subcategory: a.subcategory || "graph",
      slug: a.slug,
    };
  });
}

function highlightText(text: string, query: string): string {
  if (!text || !query) return text;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  return text.replace(regex, `<mark class="search-highlight">$1</mark>`);
}

/**
 * Real-time character-by-character substring search for articles
 */
export async function searchArticles(
  query: string,
  limit = 10
): Promise<IArticle[]> {
  await connectDB();
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(escapedQuery, "i");

  const articles = await Article.find({
    status: "published",
    $or: [
      { title: { $regex: regex } },
      { excerpt: { $regex: regex } },
      { content: { $regex: regex } },
    ],
  })
    .populate("category", "name slug icon color")
    .populate("author", "name slug avatar")
    .select("title slug excerpt coverImage readingTime publishedAt category author content primaryCategory subcategory difficulty contentType")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return articles.map((art: any) => {
    // Extract snippet around matched query from content
    const rawContent = art.content || "";
    // Clean markdown syntax for a clean preview text snippet
    const cleanContent = rawContent
      .replace(/[#*`_\[\]()\-+]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    const snippetLength = 140;
    const snippetIndex = cleanContent.toLowerCase().indexOf(query.toLowerCase());
    let snippet = "";

    if (snippetIndex !== -1) {
      const start = Math.max(0, snippetIndex - 50);
      const end = Math.min(cleanContent.length, start + snippetLength);
      snippet = cleanContent.slice(start, end);
      if (start > 0) snippet = "..." + snippet;
      if (end < cleanContent.length) snippet = snippet + "...";
    } else {
      snippet = cleanContent.slice(0, snippetLength) + (cleanContent.length > snippetLength ? "..." : "");
    }

    const injected = injectAutoTags(art);

    return {
      ...injected,
      title: highlightText(art.title, query),
      excerpt: highlightText(art.excerpt, query),
      snippet: highlightText(snippet, query),
      content: undefined, // remove full raw content to keep network footprint small
    };
  }) as unknown as IArticle[];
}
