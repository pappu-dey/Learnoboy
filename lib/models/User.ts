import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "reader" | "writer" | "superadmin";
export type WriterStatus = "none" | "pending" | "needs-review" | "approved" | "rejected";

export interface IWriterApplication {
  fullName: string;
  email: string;
  qualification: string;
  expertise: string[];
  whyWrite: string;
  college?: string;
  company?: string;
  experience?: number;
  appliedAt: Date;
}

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  
  avatar?: string;
  
  writerStatus: WriterStatus;
  
  writerApplicationMessage?: string;
  
  writerApplication?: IWriterApplication;
  
  isVerified: boolean;
  verifiedAt?: Date;
  
  resetToken?: string;
  resetTokenExpiry?: Date;
  
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const WriterApplicationSchema = new Schema<IWriterApplication>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    expertise: [{ type: String }],
    whyWrite: { type: String, required: true },
    college: { type: String, default: "" },
    company: { type: String, default: "" },
    experience: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["reader", "writer", "superadmin"],
      default: "reader",
    },
    avatar: { type: String, default: "" },
    writerStatus: {
      type: String,
      enum: ["none", "pending", "needs-review", "approved", "rejected"],
      default: "none",
    },
    writerApplicationMessage: { type: String, default: "" },
    writerApplication: { type: WriterApplicationSchema, default: null },
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User: Model<IUserDocument> =
  mongoose.models.User ||
  mongoose.model<IUserDocument>("User", UserSchema);

export default User;
