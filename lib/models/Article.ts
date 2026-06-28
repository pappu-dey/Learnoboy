import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IArticleDocument extends Document {
  title: string;
  slug: string;
  
  category: Types.ObjectId;
  
  categories: Types.ObjectId[];
  primaryCategory: string;
  subcategory: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  contentType: "Tutorial" | "Interview Prep" | "Best Practices" | "Roadmap" | "Project" | "Cheat Sheet" | "Notes";
  author: Types.ObjectId;
  tags: Types.ObjectId[];
  content: string;
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  isFeatured: boolean;
  status: "draft" | "published";
  views: number;
  likes: number;
  publishedAt?: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    ogImage?: string;
  };
  
  authorSnapshot?: {
    name: string;
    slug: string;
    avatar: string;
    isVerified: boolean;
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
    
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    primaryCategory: { type: String, required: true, lowercase: true, trim: true },
    subcategory: { type: String, required: true, lowercase: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
      required: true,
    },
    contentType: {
      type: String,
      enum: ["Tutorial", "Interview Prep", "Best Practices", "Roadmap", "Project", "Cheat Sheet", "Notes"],
      default: "Tutorial",
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
    likes: { type: Number, default: 0 },
    publishedAt: { type: Date },
    seo: {
      metaTitle: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      canonicalUrl: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      keywords: [{ type: String }],
    },
    authorSnapshot: {
      name: { type: String, default: "" },
      slug: { type: String, default: "" },
      avatar: { type: String, default: "" },
      isVerified: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


ArticleSchema.index({ category: 1, status: 1 });
ArticleSchema.index({ categories: 1, status: 1 });
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
