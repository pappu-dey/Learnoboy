import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IArticleDocument extends Document {
  title: string;
  slug: string;
  category: Types.ObjectId;
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  content: string;
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  isFeatured: boolean;
  status: "draft" | "published";
  views: number;
  publishedAt?: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticleDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    coverImage: { type: String, default: "" },
    readingTime: { type: Number, default: 1 },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for performance (slug index already created by unique:true above)
ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ status: 1, publishedAt: -1 });
ArticleSchema.index({ isFeatured: 1, status: 1 });
ArticleSchema.index({ tags: 1 });
ArticleSchema.index(
  { title: "text", excerpt: "text", content: "text" },
  { weights: { title: 10, excerpt: 5, content: 1 } }
);

const Article: Model<IArticleDocument> =
  mongoose.models.Article ||
  mongoose.model<IArticleDocument>("Article", ArticleSchema);

export default Article;
