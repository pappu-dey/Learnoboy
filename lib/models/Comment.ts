import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ICommentDocument extends Document {
  articleId: Types.ObjectId;
  user: Types.ObjectId;
  authorName: string;
  authorAvatar?: string;
  role?: string;
  isArticleAuthor: boolean;
  content: string;
  parentId?: Types.ObjectId | null;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<ICommentDocument>(
  {
    articleId: { type: Schema.Types.ObjectId, ref: "Article", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String, required: true },
    authorAvatar: { type: String, default: "" },
    role: { type: String, default: "reader" },
    isArticleAuthor: { type: Boolean, default: false },
    content: { type: String, required: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


CommentSchema.index({ articleId: 1, parentId: 1, createdAt: -1 });

const Comment: Model<ICommentDocument> =
  mongoose.models.Comment ||
  mongoose.model<ICommentDocument>("Comment", CommentSchema);

export default Comment;
