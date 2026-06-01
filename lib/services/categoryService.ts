import connectDB from "@/lib/mongodb";
import { Category } from "@/lib/models";
import type { ICategory } from "@/types";

export async function getAllCategories(): Promise<ICategory[]> {
  await connectDB();
  const categories = await Category.find()
    .populate("parent", "name slug color")
    .sort({ name: 1 })
    .lean();
  // JSON round-trip converts BSON ObjectIds → plain strings (safe to pass to Client Components)
  return JSON.parse(JSON.stringify(categories)) as unknown as ICategory[];
}

export async function getCategoryBySlug(slug: string): Promise<ICategory | null> {
  await connectDB();
  const category = await Category.findOne({ slug })
    .populate("parent", "name slug color")
    .lean();
  return category as unknown as ICategory | null;
}

export async function createCategory(data: Partial<ICategory>): Promise<ICategory> {
  await connectDB();
  const cleanData = { ...data };
  if (cleanData.parent === "" || cleanData.parent === "null") {
    cleanData.parent = null;
  }
  const category = new Category(cleanData);
  await category.save();
  return category.toObject() as unknown as ICategory;
}

export async function updateCategory(
  id: string,
  data: Partial<ICategory>
): Promise<ICategory | null> {
  await connectDB();
  const cleanData = { ...data };
  if (cleanData.parent === "" || cleanData.parent === "null") {
    cleanData.parent = null;
  }
  const category = await Category.findByIdAndUpdate(id, cleanData, { new: true })
    .populate("parent", "name slug color")
    .lean();
  return category as unknown as ICategory | null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await connectDB();
  const result = await Category.findByIdAndDelete(id);
  return !!result;
}
