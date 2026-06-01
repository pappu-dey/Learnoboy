import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  parent?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "📚" },
    color: { type: String, default: "#3b82f6" },
    articleCount: { type: Number, default: 0 },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// NOTE: slug's unique index is already created by `unique: true` above.
// Adding CategorySchema.index({ slug: 1 }) here would create a duplicate.

const Category: Model<ICategoryDocument> =
  mongoose.models.Category ||
  mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default Category;
