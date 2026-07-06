import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUploadDocument extends Document {
  originalFilename: string;
  optimizedFilename: string;
  filePath: string;
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
  altText?: string;
  blurPlaceholder?: string;
  responsiveSizes: number[];
  articleId?: string;
  createdAt: Date;
}

const UploadSchema = new Schema<IUploadDocument>({
  originalFilename: { type: String, required: true, trim: true },
  optimizedFilename: { type: String, required: true, trim: true },
  filePath: { type: String, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  mimeType: { type: String, required: true, default: "image/webp" },
  fileSize: { type: Number, required: true },
  altText: { type: String, default: "" },
  blurPlaceholder: { type: String, default: "" },
  responsiveSizes: [{ type: Number }],
  articleId: { type: String, index: true },
  createdAt: { type: Date, default: Date.now },
});

// Compound index for quick query references
UploadSchema.index({ createdAt: -1 });

const Upload: Model<IUploadDocument> =
  mongoose.models.Upload ||
  mongoose.model<IUploadDocument>("Upload", UploadSchema);

export default Upload;
