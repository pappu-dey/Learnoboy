import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISubcategoryDocument extends Document {
  name: string;
  slug: string;
  description?: string;
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  articleCount: number;
  subcategories: Types.DocumentArray<ISubcategoryDocument> | any[];
  createdAt: Date;
  updatedAt: Date;
}

const SubcategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    articleCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    icon: { type: String, default: "📚" },
    color: { type: String, default: "#3b82f6" },
    articleCount: { type: Number, default: 0 },
    subcategories: [SubcategorySchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);




const Category: Model<ICategoryDocument> =
  mongoose.models.Category ||
  mongoose.model<ICategoryDocument>("Category", CategorySchema);

export default Category;
