import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "reader" | "writer" | "superadmin";
export type WriterStatus = "none" | "pending" | "approved" | "rejected";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  /** Profile picture URL (Cloudinary) */
  avatar?: string;
  /** Track writer application status */
  writerStatus: WriterStatus;
  writerApplicationMessage?: string;
  /** Password reset fields */
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

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
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    writerApplicationMessage: { type: String, default: "" },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
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
