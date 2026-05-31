import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAuthorDocument extends Document {
  name: string;
  slug: string;
  bio: string;
  avatar: string;
  bannerImage?: string;
  email: string;
  location?: string;
  qualification?: string;
  company?: string;
  experience?: number;
  expertise: string[];
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    portfolio?: string;
  };
  isVerified: boolean;
  verifiedAt?: Date;
  articleCount: number;
  totalViews: number;
  /** Reference back to the User document */
  userId?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AuthorSchema = new Schema<IAuthorDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    bio: { type: String, default: "" },
    avatar: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    email: { type: String, required: true, unique: true, lowercase: true },
    location: { type: String, default: "" },
    qualification: { type: String, default: "" },
    company: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    expertise: [{ type: String }],
    social: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      website: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    articleCount: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
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
