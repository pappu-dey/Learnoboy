import connectDB from "@/lib/mongodb";
// Import all models together to ensure they're all registered before populate() runs
import { Article, Category, Author, Tag } from "@/lib/models";
import type { IArticle, PaginatedResponse } from "@/types";

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
      filter.category = categoryDoc._id;
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

  if (options.tag) {
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
      .populate("author", "name slug avatar isVerified")
      .populate("tags", "name slug")
      .sort(sortMap[sort])
      .skip(skip)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter),
  ]);

  return {
    data: articles as unknown as IArticle[],
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
    .populate("author", "name slug avatar bio social isVerified expertise location totalViews articleCount")
    .populate("tags", "name slug")
    .lean();

  if (!article) return null;

  const populated = article as unknown as IArticle;
  const category =
    typeof populated.category === "object" ? populated.category : null;
  if (category && category.slug !== categorySlug) return null;

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
    .populate("author", "name slug avatar bio isVerified")
    .populate("tags", "name slug")
    .lean();

  return article as unknown as IArticle | null;
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
    .select("title slug excerpt coverImage readingTime publishedAt")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return articles as unknown as IArticle[];
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

/**
 * Create a new article
 */
export async function createArticle(data: Partial<IArticle>): Promise<IArticle> {
  await connectDB();
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
  const article = await Article.findByIdAndUpdate(id, data, { new: true })
    .populate("category", "name slug")
    .populate("author", "name slug avatar")
    .populate("tags", "name slug")
    .lean();

  return article as unknown as IArticle | null;
}

/**
 * Delete article by ID
 */
export async function deleteArticle(id: string): Promise<boolean> {
  await connectDB();
  const result = await Article.findByIdAndDelete(id);
  return !!result;
}

/**
 * Get all slugs for static generation
 */
export async function getAllArticleSlugs(): Promise<
  { category: string; slug: string }[]
> {
  await connectDB();
  const articles = await Article.find({ status: "published" })
    .populate("category", "slug")
    .select("slug category")
    .lean();

  return articles.map((a: unknown) => {
    const article = a as { slug: string; category: { slug: string } };
    return {
      category:
        typeof article.category === "object"
          ? article.category.slug
          : "uncategorized",
      slug: article.slug,
    };
  });
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
    .select("title slug excerpt coverImage readingTime publishedAt category author")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return articles as unknown as IArticle[];
}
