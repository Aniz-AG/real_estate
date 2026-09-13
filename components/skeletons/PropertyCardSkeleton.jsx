import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the PropertyCard layout in pages/browse.js so the skeleton grid
// doesn't jump around in size once real cards swap in.
export default function PropertyCardSkeleton({ viewMode = "grid" }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div
        className={`flex ${viewMode === "list" ? "flex-col md:flex-row" : "flex-col"}`}
      >
        <Skeleton
          className={`rounded-none ${viewMode === "list" ? "w-full md:w-72 h-52 md:h-48" : "w-full h-48"}`}
        />
        <div className="flex-1 p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/3" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-12" />
            <Skeleton className="h-3.5 w-16" />
          </div>
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({ viewMode = "grid", count = 6 }) {
  return (
    <div
      className={
        viewMode === "grid"
          ? "grid grid-cols-1 md:grid-cols-2 gap-4"
          : "space-y-4"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} viewMode={viewMode} />
      ))}
    </div>
  );
}
