import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDonorDocument extends Document {
  name: string;
  email: string;
  amount: number;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const DonorSchema = new Schema<IDonorDocument>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Donor: Model<IDonorDocument> =
  mongoose.models.Donor ||
  mongoose.model<IDonorDocument>("Donor", DonorSchema);

export default Donor;
