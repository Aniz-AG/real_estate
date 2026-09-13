import { Skeleton } from "@/components/ui/skeleton";

// Mirrors pages/builders/[id].js: dark header band + property tile grid.
export default function BuilderStorefrontSkeleton() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="w-24 h-24 rounded-2xl bg-white/10 flex-shrink-0" />
            <div className="flex-1 space-y-3 w-full max-w-md">
              <Skeleton className="h-7 w-2/3 bg-white/10 mx-auto sm:mx-0" />
              <Skeleton className="h-4 w-full bg-white/10" />
              <Skeleton className="h-4 w-3/4 bg-white/10 mx-auto sm:mx-0" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <Skeleton className="h-6 w-64 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
              <Skeleton className="h-44 w-full rounded-none" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-5 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
