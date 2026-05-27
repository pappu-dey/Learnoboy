import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuthorDocument extends Document {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  email: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  };
  articleCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthorDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    social: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    articleCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// NOTE: slug and email unique indexes are created by `unique: true` above.
// Adding explicit AuthorSchema.index() calls for them would be duplicates.

const Author: Model<IAuthorDocument> =
  mongoose.models.Author ||
  mongoose.model<IAuthorDocument>("Author", AuthorSchema);

export default Author;
