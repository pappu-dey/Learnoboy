"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteArticleButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/articles/${articleId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/articles");
        router.refresh();
      } else {
        alert("Failed to delete article. Please try again.");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-red-600 border border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
    >
      <Trash2 size={14} />
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
