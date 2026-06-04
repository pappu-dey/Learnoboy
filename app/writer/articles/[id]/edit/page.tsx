import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getArticleById } from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import Tag from "@/lib/models/Tag";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { IAuthor, ITag, ICategory } from "@/types";
import { serialize, serializeArray } from "@/lib/utils/serialize";

export const metadata: Metadata = { title: "Edit Article — Writer — Learno-Boy" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function WriterEditArticlePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "writer" && session.role !== "superadmin") {
    redirect("/profile");
  }

  const { id } = await params;
  await connectDB();

  const [article, categories, authors, tags] = await Promise.all([
    getArticleById(id).catch(() => null),
    getAllCategories().catch(() => []),
    Author.find().select("_id name slug").lean().catch(() => []) as Promise<IAuthor[]>,
    Tag.find().select("_id name slug").lean().catch(() => []) as Promise<ITag[]>,
  ]);

  if (!article) notFound();

  // Find this writer's Author document
  const authorDoc = await Author.findOne({ email: session.email }).lean();
  const loggedInAuthorId = authorDoc ? String((authorDoc as { _id: unknown })._id) : "";

  // Secure: check if the logged-in writer is the author of this article (unless superadmin)
  const articleAuthorId = typeof article.author === "object" ? String(article.author._id) : String(article.author);
  if (session.role === "writer" && articleAuthorId !== loggedInAuthorId) {
    redirect("/writer");
  }

  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;

  // Build all category IDs (multi-category support)
  const categoriesArr = Array.isArray(article.categories) ? article.categories : [];
  const categoryIds: string[] = categoriesArr
    .filter((c) => typeof c === "object" && c._id)
    .map((c) => String((c as ICategory)._id));
  if (categoryIds.length === 0 && category?._id) {
    categoryIds.push(String(category._id));
  }

  const initialData = serialize({
    _id: String(article._id),
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    categoryId: category?._id ? String(category._id) : "",
    categoryIds,
    authorId: articleAuthorId,
    tagIds: article.tags
      ? article.tags
          .filter((t) => typeof t === "object")
          .map((t) => String((t as ITag)._id))
      : [],
    coverImage: article.coverImage || "",
    isFeatured: article.isFeatured,
    status: article.status,
    seoTitle: article.seo?.metaTitle || "",
    seoDescription: article.seo?.metaDescription || "",
    primaryCategory: article.primaryCategory || "",
    subcategory: article.subcategory || "",
    difficulty: article.difficulty || "Beginner",
    contentType: article.contentType || "Tutorial",
    seoKeywords: article.seo?.keywords || [],
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Edit Article
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-1 max-w-md">
            {article.title}
          </p>
        </div>
      </div>

      <ArticleForm
        categories={serializeArray(categories)}
        authors={serializeArray(authors as unknown as IAuthor[]) as unknown as IAuthor[]}
        tags={serializeArray(tags as unknown as ITag[]) as unknown as ITag[]}
        initialData={initialData}
        isEdit
        sessionRole={session.role}
      />
    </div>
  );
}
