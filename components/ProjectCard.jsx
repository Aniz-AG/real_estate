import Link from "next/link";
import { ArrowRight, Crown, MapPin, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const formatPrice = (price) => {
  if (!Number.isFinite(price)) return "Price on request";
  if (price >= 10000000)
    return `INR ${(price / 10000000).toFixed(2)} Cr onwards`;
  if (price >= 100000) return `INR ${(price / 100000).toFixed(2)} Lac onwards`;
  return `INR ${price.toLocaleString("en-IN")} onwards`;
};

const formatStatus = (status) => {
  if (status === "ready_to_move") return "Ready to Move";
  if (status === "under_construction") return "Under Construction";
  return "Available";
};

const getTypeLabel = (project) => {
  if (project.bhk_type) {
    return `${project.bhk_type} ${project.property_type?.replace(/_/g, " ")}`;
  }
  return project.property_type?.replace(/_/g, " ") || "Project";
};

export default function ProjectCard({ project, variant = "row" }) {
  const mainImage = project.photos?.[0]?.url || "/placeholder-property.jpg";
  const location = project.address
    ? `${project.address.city}, ${project.address.state}`
    : "Location on request";
  const title = project.project_name || project.title || "Project";
  const builder = project.builder_name || "Builder";
  const statusLabel = formatStatus(project.possession_status);
  const typeLabel = getTypeLabel(project);
  const badgeLabel = project.is_premium
    ? "Premium"
    : project.is_top_project
      ? "Top Project"
      : "New Launch";

  if (variant === "tile") {
    return (
      <Card className="group h-full overflow-hidden border border-amber-100/70 bg-gradient-to-br from-white via-[#FFF7E1] to-[#F8FAFC] shadow-[0_20px_50px_-35px_rgba(120,53,15,0.55)] hover:shadow-[0_30px_70px_-40px_rgba(120,53,15,0.7)] transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={mainImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
            <Sparkles className="h-3 w-3 text-amber-500" />
            {badgeLabel}
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                {builder}
              </p>
              <h3 className="text-lg font-semibold leading-snug font-display">
                {title}
              </h3>
            </div>
            {project.is_premium && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
                <Crown className="h-3 w-3" /> Elite
              </span>
            )}
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4 text-amber-600" />
            {location}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              {statusLabel}
            </span>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
              {typeLabel}
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Starting from
              </p>
              <p className="text-lg font-bold text-[#C4302B]">
                {formatPrice(project.price)}
              </p>
            </div>
            <Link href={`/property/${project._id}`}>
              <Button className="rounded-full bg-[#C4302B] text-white hover:bg-[#A52521]">
                Explore
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border border-amber-100/80 bg-gradient-to-br from-white via-[#FFF7E1] to-[#F8FAFC] shadow-[0_24px_60px_-40px_rgba(120,53,15,0.6)] hover:shadow-[0_30px_70px_-40px_rgba(120,53,15,0.7)] transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        <div className="relative h-56 md:h-full">
          <img
            src={mainImage}
            alt={title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
              <Sparkles className="h-3 w-3 text-amber-500" />
              {badgeLabel}
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700">
              {statusLabel}
            </span>
          </div>
        </div>

        <CardContent className="flex flex-col justify-between gap-4 p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              {builder}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h3 className="text-xl font-semibold text-slate-900 font-display">
                {title}
              </h3>
              {project.is_premium && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-semibold text-slate-900">
                  <Crown className="h-3 w-3" /> Elite
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {location}
            </div>
            <div className="mt-3 text-sm text-slate-600">{typeLabel}</div>
          </div>

          <div className="flex items-center justify-between border-t border-amber-100/60 pt-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Starting from
              </p>
              <p className="text-lg font-bold text-[#C4302B]">
                {formatPrice(project.price)}
              </p>
            </div>
            <Link href={`/property/${project._id}`}>
              <Button className="rounded-full bg-[#C4302B] text-white hover:bg-[#A52521]">
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
