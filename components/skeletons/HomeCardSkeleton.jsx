import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the local PropertyCard used in the homepage carousels (h-52 image
// + padded content block) so the carousel row doesn't reflow when data lands.
export default function HomeCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-100 shadow-lg overflow-hidden bg-white">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function HomeCardSkeletonRow({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <HomeCardSkeleton key={i} />
      ))}
    </div>
  );
}
