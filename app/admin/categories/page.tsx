import type { Metadata } from "next";
import { getAllCategories } from "@/lib/services/categoryService";
import { serializeArray } from "@/lib/utils/serialize";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = { title: "Manage Categories" };
export const dynamic = "force-dynamic"; 

export default async function AdminCategoriesPage() {
  const raw = await getAllCategories().catch((err) => {
    console.error("❌ Error fetching categories in AdminCategoriesPage:", err);
    return [];
  });
  
  
  const categories = serializeArray(raw);

  return <AdminCategoriesClient initialCategories={categories} />;
}
