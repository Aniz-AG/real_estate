import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the article Card layout in pages/insights.js.
export default function InsightCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-32 mt-2" />
      </div>
    </div>
  );
}

export function InsightGridSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <InsightCardSkeleton key={i} />
      ))}
    </div>
  );
}
