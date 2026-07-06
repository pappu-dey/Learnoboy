import connectDB from "@/lib/mongodb";
import { Category } from "@/lib/models";
import type { ICategory } from "@/types";
import { cache } from "react";

export const getAllCategories = cache(async (): Promise<ICategory[]> => {
  await connectDB();
  const categories = await Category.find()
    .sort({ name: 1 })
    .lean();
  return JSON.parse(JSON.stringify(categories)) as unknown as ICategory[];
});

export const getCategoryBySlug = cache(async (slug: string): Promise<ICategory | null> => {
  await connectDB();
  const category = await Category.findOne({ slug }).lean();
  return category as unknown as ICategory | null;
});

export async function createCategory(data: any): Promise<any> {
  await connectDB();
  const { name, slug, description, color, parent } = data;

  if (parent && parent !== "null") {
    const parentCat = await Category.findById(parent);
    if (!parentCat) {
      throw new Error("Parent category not found");
    }

    const exists = parentCat.subcategories?.some((sub: any) => sub.slug === slug);
    if (exists) {
      const err = new Error("Subcategory with this slug already exists");
      (err as any).code = 11000;
      throw err;
    }

    parentCat.subcategories.push({
      name,
      slug,
      description,
      articleCount: 0
    });
    await parentCat.save();
    return JSON.parse(JSON.stringify(parentCat.toObject()));
  } else {
    const category = new Category({
      name,
      slug,
      description,
      icon: data.icon || "📚",
      color: color || "#3b82f6",
      articleCount: 0,
      subcategories: [],
    });
    await category.save();
    return JSON.parse(JSON.stringify(category.toObject()));
  }
}

export async function updateCategory(
  id: string,
  data: any
): Promise<any | null> {
  await connectDB();
  
  let category = await Category.findByIdAndUpdate(id, data, { new: true }).lean();
  if (!category) {
    const parentCat = await Category.findOne({ "subcategories._id": id });
    if (parentCat) {
      const sub = (parentCat.subcategories as any).id(id);
      if (sub) {
        if (data.name) sub.name = data.name;
        if (data.slug) sub.slug = data.slug;
        if (data.description) sub.description = data.description;
        await parentCat.save();
        return JSON.parse(JSON.stringify(parentCat.toObject()));
      }
    }
  }
  return category ? JSON.parse(JSON.stringify(category)) : null;
}

export async function deleteCategory(id: string): Promise<boolean> {
  await connectDB();
  const result = await Category.findByIdAndDelete(id);
  if (!result) {
    const parentCat = await Category.findOneAndUpdate(
      { "subcategories._id": id },
      { $pull: { subcategories: { _id: id } } },
      { new: true }
    );
    return !!parentCat;
  }
  return true;
}
