"use client";

import { usePathname } from "next/navigation";
import { DashboardSkeleton, FormSkeleton } from "@/components/ui/Skeleton";

export default function WriterLoading() {
  const pathname = usePathname();
  const isFormPage = pathname?.endsWith("/new") || pathname?.includes("/edit") || pathname?.endsWith("/new/");
  
  if (isFormPage) {
    return <FormSkeleton />;
  }

  return <DashboardSkeleton />;
}
