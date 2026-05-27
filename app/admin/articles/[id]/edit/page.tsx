import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/services/articleService";
import { getAllCategories } from "@/lib/services/categoryService";
import connectDB from "@/lib/mongodb";
import Author from "@/lib/models/Author";
import Tag from "@/lib/models/Tag";
import { ArticleForm } from "@/components/admin/ArticleForm";
import type { IAuthor, ITag, ICategory } from "@/types";
import { serialize, serializeArray } from "@/lib/utils/serialize";
import DeleteArticleButton from "./DeleteArticleButton";

export const metadata: Metadata = { title: "Edit Article" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  await connectDB();

  const [article, categories, authors, tags] = await Promise.all([
    getArticleById(id).catch(() => null),
    getAllCategories().catch(() => []),
    Author.find().select("_id name slug").lean().catch(() => []) as Promise<IAuthor[]>,
    Tag.find().select("_id name slug").lean().catch(() => []) as Promise<ITag[]>,
  ]);

  if (!article) notFound();

  const category =
    typeof article.category === "object"
      ? (article.category as ICategory)
      : null;

  // Serialize to convert ObjectIds → strings before crossing server→client boundary
  const initialData = serialize({
    _id: String(article._id),
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    categoryId: category?._id ? String(category._id) : "",
    authorId:
      typeof article.author === "object" ? String(article.author._id) : String(article.author),
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
        <DeleteArticleButton articleId={String(article._id)} />
      </div>

      <ArticleForm
        categories={serializeArray(categories)}
        authors={serializeArray(authors as unknown as IAuthor[]) as unknown as IAuthor[]}
        tags={serializeArray(tags as unknown as ITag[]) as unknown as ITag[]}
        initialData={initialData}
        isEdit
      />
    </div>
  );
}
