import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  Crown,
  Loader2,
  Bed,
  Bath,
  Maximize,
  MapPin,
} from "lucide-react";
import { formatPriceDisplay } from "@/lib/constants";

function PropertyTile({ property }) {
  const mainImage = property.photos?.[0]?.url || "/placeholder-property.jpg";
  return (
    <Link href={`/property/${property._id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-44 w-full">
          <img
            src={mainImage}
            alt={property.title || "Property"}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm text-gray-800 line-clamp-1">
            {property.title ||
              `${property.bhk_type || ""} ${property.property_type?.replace(/_/g, " ")}`}
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            {property.address?.locality || property.address?.city}
          </p>
          <p className="text-base font-bold text-primary mt-2">
            {property.price_text ||
              formatPriceDisplay(property.price, property.price_max)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function BuilderStorefront() {
  const router = useRouter();
  const { id } = router.query;
  const [builder, setBuilder] = useState(null);
  const [properties, setProperties] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPage = async (pageNumber, replace) => {
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
    try {
      const { data } = await axios.get(
        `/api/builders/${id}?page=${pageNumber}`,
      );
      if (!data.success) {
        setNotFound(true);
        return;
      }
      setBuilder(data.builder);
      setProperties((prev) =>
        replace ? data.properties : [...prev, ...data.properties],
      );
      setPage(data.page);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (notFound || !builder) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Builder not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SeoHead
        title={`${builder.name} - Projects & Listings`}
        description={
          builder.description ||
          `Explore all properties and projects by ${builder.name}.`
        }
      />

      {/* Storefront Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white flex items-center justify-center flex-shrink-0 shadow-xl">
              {builder.logo?.url ? (
                <img
                  src={builder.logo.url}
                  alt={builder.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-10 w-10 text-slate-400" />
              )}
            </div>
            <div className="text-center sm:text-left flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  {builder.name}
                </h1>
                {builder.is_premium && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900">
                    <Crown className="h-3.5 w-3.5" /> Premium Partner
                  </span>
                )}
              </div>
              {builder.description && (
                <p className="text-slate-300 mt-2 max-w-2xl">
                  {builder.description}
                </p>
              )}
              <div className="flex items-center justify-center sm:justify-start flex-wrap gap-4 mt-4 text-sm text-slate-300">
                <span>{total} Active Listing{total !== 1 ? "s" : ""}</span>
                {builder.website && (
                  <a
                    href={builder.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    <Globe className="h-4 w-4" /> Website
                  </a>
                )}
                {builder.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-4 w-4" /> {builder.phone}
                  </span>
                )}
                {builder.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-4 w-4" /> {builder.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Projects & Listings by {builder.name}
        </h2>
        {properties.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">
            No active listings from this builder right now.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {properties.map((property) => (
                <PropertyTile key={property._id} property={property} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => fetchPage(page + 1, false)}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  );
}
