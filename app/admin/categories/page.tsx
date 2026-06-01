import type { Metadata } from "next";
import { getAllCategories } from "@/lib/services/categoryService";
import { serializeArray } from "@/lib/utils/serialize";
import { AdminCategoriesClient } from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = { title: "Manage Categories" };
export const dynamic = "force-dynamic"; // always fresh after a new category is created

export default async function AdminCategoriesPage() {
  const raw = await getAllCategories().catch((err) => {
    console.error("❌ Error fetching categories in AdminCategoriesPage:", err);
    return [];
  });
  // Convert ObjectIds / Dates → plain strings before crossing the
  // Server → Client boundary (Next.js rejects non-plain objects in props).
  const categories = serializeArray(raw);

  return <AdminCategoriesClient initialCategories={categories} />;
}
