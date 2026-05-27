import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITagDocument extends Document {
  name: string;
  slug: string;
  articleCount: number;
  createdAt: Date;
}

const TagSchema = new Schema<ITagDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    articleCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tag: Model<ITagDocument> =
  mongoose.models.Tag || mongoose.model<ITagDocument>("Tag", TagSchema);

export default Tag;
