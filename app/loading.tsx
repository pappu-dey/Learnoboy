import { HomePageSkeleton } from "@/components/ui/Skeleton";

/**
 * Next.js App Router loading.tsx
 * Automatically shown by the framework while the home page (page.tsx)
 * is fetching data from the server (MongoDB cold start, ISR revalidation, etc.)
 */
export default function HomeLoading() {
  return <HomePageSkeleton />;
}
