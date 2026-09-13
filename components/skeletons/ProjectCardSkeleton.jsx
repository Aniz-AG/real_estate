import { Skeleton } from "@/components/ui/skeleton";

// Mirrors components/ProjectCard.jsx's "tile" and "row" variants.
export default function ProjectCardSkeleton({ variant = "row" }) {
  if (variant === "tile") {
    return (
      <div className="h-full overflow-hidden rounded-lg border border-amber-100/70 bg-white">
        <Skeleton className="h-48 w-full rounded-none" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white">
      <Skeleton className="w-full md:w-72 h-52 md:h-48 rounded-none" />
      <div className="flex-1 p-4 space-y-3">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-32 rounded-md mt-2" />
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ variant = "row", count = 4 }) {
  return (
    <div
      className={
        variant === "tile"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          : "grid grid-cols-1 lg:grid-cols-2 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProjectCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
