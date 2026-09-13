import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the pages/property/[id].js layout: gallery grid, 2-col content
// with a sticky sidebar, so the page doesn't jump/reflow when data lands.
export default function PropertyDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 sm:mb-8">
        <Skeleton className="h-64 sm:h-80 lg:h-[500px] rounded-lg" />
        <div className="flex lg:grid lg:grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="min-w-[140px] h-32 sm:h-40 lg:h-60 rounded-lg flex-1"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-10" />
              <Skeleton className="h-5 w-32" />
            </div>
          </div>
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-40" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-5 rounded-full mx-auto" />
                <Skeleton className="h-3 w-12 mx-auto" />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 p-5 space-y-4">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
          <div className="rounded-lg border border-gray-200 p-5 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
