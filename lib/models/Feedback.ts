import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeedbackDocument extends Document {
  type: "Bug Report" | "Feature Request" | "Content Suggestion" | "General Feedback";
  message: string;
  email?: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new Schema<IFeedbackDocument>(
  {
    type: {
      type: String,
      required: true,
      enum: ["Bug Report", "Feature Request", "Content Suggestion", "General Feedback"],
    },
    message: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    status: {
      type: String,
      required: true,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Feedback: Model<IFeedbackDocument> =
  mongoose.models.Feedback ||
  mongoose.model<IFeedbackDocument>("Feedback", FeedbackSchema);

export default Feedback;
