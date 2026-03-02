import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Layout from "@/components/Layout";
import SeoHead from "@/components/SeoHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Heart,
  Phone,
  Mail,
  Share2,
  Car,
  Zap,
  Shield,
  Waves,
  Dumbbell,
  Building2,
  Baby,
  TreePine,
  Flame,
  Droplets,
  CloudRain,
  Radio,
  Users,
  ShoppingCart,
  Hospital,
  GraduationCap,
  Landmark,
  Eye,
  Calendar,
  Layers,
  Home,
  ArrowUpDown,
  Armchair,
  Check,
} from "lucide-react";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";

export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/property/${id}`);
      setProperty(data.property);
      if (user && user.likes) {
        setIsLiked(user.likes.includes(id));
      }
    } catch (error) {
      toast.error("Failed to load property");
      router.push("/browse");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to save properties");
      router.push("/login");
      return;
    }

    try {
      await axios.post(`/api/user/like/${id}/${user._id}`);
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold">Property not found</h2>
        </div>
      </Layout>
    );
  }

  const canonical = `${baseUrl}/property/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: property.address?.property_address,
    description: property.description,
    url: canonical,
    image: property.photos?.map((photo) => photo.url).filter(Boolean),
    numberOfRooms: property.nums_bedrooms,
    numberOfBathroomsTotal: property.nums_bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.square_feet,
      unitText: "SQFT",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address?.property_address,
      addressLocality: property.address?.city,
      addressRegion: property.address?.state,
      postalCode: property.address?.pincode,
      addressCountry: "IN",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
    },
    seller: property.uploaded_by && {
      "@type": "RealEstateAgent",
      name: property.uploaded_by.username,
      telephone: property.uploaded_by.phone,
      email: property.uploaded_by.email,
      address: property.uploaded_by.city,
    },
  };

  return (
    <Layout>
      <SeoHead
        title={property.address?.property_address}
        description={property.description?.slice(0, 150)}
        image={property.photos?.[0]?.url}
        type="article"
        canonical={canonical}
        jsonLd={jsonLd}
      />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Image Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6 sm:mb-8">
          <div className="relative h-64 sm:h-80 lg:h-[500px] rounded-lg overflow-hidden">
            <img
              src={
                property.photos[currentImageIndex]?.url ||
                "/placeholder-property.jpg"
              }
              alt="Property"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex lg:grid lg:grid-cols-2 gap-3 overflow-x-auto lg:overflow-visible">
            {property.photos.slice(1, 5).map((photo, index) => (
              <div
                key={index}
                className="relative min-w-[140px] h-32 sm:h-40 lg:h-60 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setCurrentImageIndex(index + 1)}
              >
                <img
                  src={photo.url}
                  alt={`Property ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    {property.address.property_address}
                  </h1>
                  <p className="text-lg text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {property.address.city}, {property.address.state} -{" "}
                    {property.address.pincode}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const propertyUrl = `${baseUrl}/property/${id}`;
                      const title = `${property.bhk_type || ""} ${property.property_type?.replace(/_/g, " ")} for ${property.usage_type === "rent" ? "Rent" : "Sale"} in ${property.address?.city}`;
                      const price = formatPrice(property.price);
                      const message = `Check out this property: ${title}\nPrice: ${price}\nArea: ${property.square_feet || property.covered_area} sqft\nLocation: ${property.address?.property_address}\n\n${propertyUrl}`;
                      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, "_blank");
                    }}
                    className="h-11 w-11 sm:h-12 sm:w-12 hover:bg-green-50 hover:border-green-500 hover:text-green-600"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="h-6 w-6" />
                  </Button>
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="icon"
                    onClick={handleLike}
                    className="h-11 w-11 sm:h-12 sm:w-12"
                  >
                    <Heart
                      className={`h-6 w-6 ${isLiked ? "fill-current" : ""}`}
                    />
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                <span className="bg-primary text-white px-4 py-2 rounded-full font-semibold capitalize">
                  For {property.usage_type}
                </span>
                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold capitalize">
                  {property.status}
                </span>
                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold capitalize">
                  {property.property_type}
                </span>
              </div>

              <div className="text-3xl sm:text-4xl font-bold text-primary mb-6">
                {formatPrice(property.price)}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {property.nums_bedrooms}
                    </p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">
                      {property.nums_bathrooms}
                    </p>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Maximize className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">{property.square_feet}</p>
                    <p className="text-sm text-muted-foreground">Sq Ft</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {property.description}
                </p>
              </CardContent>
            </Card>

            {/* Property Details Section */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.property_type && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Home className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Property Type
                        </p>
                        <p className="font-medium capitalize">
                          {property.property_type.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.bhk_type && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Bed className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Configuration
                        </p>
                        <p className="font-medium">{property.bhk_type}</p>
                      </div>
                    </div>
                  )}
                  {property.nums_balconies > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Balconies
                        </p>
                        <p className="font-medium">{property.nums_balconies}</p>
                      </div>
                    </div>
                  )}
                  {property.furnishing && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Armchair className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Furnishing
                        </p>
                        <p className="font-medium capitalize">
                          {property.furnishing.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.floor_number && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Layers className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Floor</p>
                        <p className="font-medium capitalize">
                          {property.floor_number} of{" "}
                          {property.total_floors || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.facing && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <ArrowUpDown className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Facing</p>
                        <p className="font-medium capitalize">
                          {property.facing.replace(/-/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.possession_status && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Possession
                        </p>
                        <p className="font-medium capitalize">
                          {property.possession_status.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.property_age && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Property Age
                        </p>
                        <p className="font-medium capitalize">
                          {property.property_age.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.ownership && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Landmark className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Ownership
                        </p>
                        <p className="font-medium capitalize">
                          {property.ownership.replace(/_/g, " ")}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.covered_area > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Maximize className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Super Built-up Area
                        </p>
                        <p className="font-medium">
                          {property.covered_area} sqft
                        </p>
                      </div>
                    </div>
                  )}
                  {property.carpet_area > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Maximize className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Carpet Area
                        </p>
                        <p className="font-medium">
                          {property.carpet_area} sqft
                        </p>
                      </div>
                    </div>
                  )}
                  {property.price_per_sqft > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                      <Eye className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Price per sqft
                        </p>
                        <p className="font-medium">
                          ₹{property.price_per_sqft.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Amenities Section */}
            {property.amenities && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {property.amenities.reserved_parking && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Car className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Reserved Parking
                        </span>
                      </div>
                    )}
                    {property.amenities.visitor_parking && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <Car className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700">
                          Visitor Parking
                        </span>
                      </div>
                    )}
                    {property.amenities.lift && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <ArrowUpDown className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Lift
                        </span>
                      </div>
                    )}
                    {property.amenities.power_backup && (
                      <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <Zap className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">
                          Power Backup
                        </span>
                      </div>
                    )}
                    {property.amenities.gas_pipeline && (
                      <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <Flame className="h-5 w-5 text-orange-600" />
                        <span className="text-sm font-medium text-orange-700">
                          Piped Gas
                        </span>
                      </div>
                    )}
                    {property.amenities.park && (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                        <TreePine className="h-5 w-5 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-700">
                          Park
                        </span>
                      </div>
                    )}
                    {property.amenities.kids_play_area && (
                      <div className="flex items-center gap-2 p-3 bg-pink-50 border border-pink-200 rounded-lg">
                        <Baby className="h-5 w-5 text-pink-600" />
                        <span className="text-sm font-medium text-pink-700">
                          Kids Play Area
                        </span>
                      </div>
                    )}
                    {property.amenities.gymnasium && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Dumbbell className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">
                          Gymnasium
                        </span>
                      </div>
                    )}
                    {property.amenities.swimming_pool && (
                      <div className="flex items-center gap-2 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
                        <Waves className="h-5 w-5 text-cyan-600" />
                        <span className="text-sm font-medium text-cyan-700">
                          Swimming Pool
                        </span>
                      </div>
                    )}
                    {property.amenities.club_house && (
                      <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <Building2 className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                          Club House
                        </span>
                      </div>
                    )}
                    {property.amenities.security && (
                      <div className="flex items-center gap-2 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">
                          24x7 Security
                        </span>
                      </div>
                    )}
                    {property.amenities.cctv && (
                      <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <Eye className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">
                          CCTV Surveillance
                        </span>
                      </div>
                    )}
                    {property.amenities.fire_safety && (
                      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <Flame className="h-5 w-5 text-red-600" />
                        <span className="text-sm font-medium text-red-700">
                          Fire Safety
                        </span>
                      </div>
                    )}
                    {property.amenities.water_storage && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Droplets className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">
                          Water Storage
                        </span>
                      </div>
                    )}
                    {property.amenities.rain_water_harvesting && (
                      <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                        <CloudRain className="h-5 w-5 text-teal-600" />
                        <span className="text-sm font-medium text-teal-700">
                          Rain Water Harvesting
                        </span>
                      </div>
                    )}
                    {property.amenities.sewage_treatment && (
                      <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-lg">
                        <Droplets className="h-5 w-5 text-stone-600" />
                        <span className="text-sm font-medium text-stone-700">
                          Sewage Treatment
                        </span>
                      </div>
                    )}
                    {property.amenities.intercom && (
                      <div className="flex items-center gap-2 p-3 bg-violet-50 border border-violet-200 rounded-lg">
                        <Radio className="h-5 w-5 text-violet-600" />
                        <span className="text-sm font-medium text-violet-700">
                          Intercom
                        </span>
                      </div>
                    )}
                    {property.amenities.maintenance_staff && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <Users className="h-5 w-5 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                          Maintenance Staff
                        </span>
                      </div>
                    )}
                    {property.amenities.shopping_center && (
                      <div className="flex items-center gap-2 p-3 bg-fuchsia-50 border border-fuchsia-200 rounded-lg">
                        <ShoppingCart className="h-5 w-5 text-fuchsia-600" />
                        <span className="text-sm font-medium text-fuchsia-700">
                          Shopping Center
                        </span>
                      </div>
                    )}
                    {property.amenities.hospital && (
                      <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                        <Hospital className="h-5 w-5 text-rose-600" />
                        <span className="text-sm font-medium text-rose-700">
                          Hospital Nearby
                        </span>
                      </div>
                    )}
                    {property.amenities.school && (
                      <div className="flex items-center gap-2 p-3 bg-sky-50 border border-sky-200 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-sky-600" />
                        <span className="text-sm font-medium text-sky-700">
                          School Nearby
                        </span>
                      </div>
                    )}
                    {property.amenities.atm && (
                      <div className="flex items-center gap-2 p-3 bg-lime-50 border border-lime-200 rounded-lg">
                        <Landmark className="h-5 w-5 text-lime-600" />
                        <span className="text-sm font-medium text-lime-700">
                          ATM Nearby
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Show message if no amenities */}
                  {!Object.values(property.amenities).some(
                    (v) => v === true,
                  ) && (
                    <p className="text-muted-foreground text-center py-4">
                      No amenities information available
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Agent Card */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <Card className="lg:sticky lg:top-20">
              <CardHeader>
                <CardTitle>Contact Agent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={property.uploaded_by?.photo?.url} />
                    <AvatarFallback>
                      {property.uploaded_by?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-lg">
                      {property.uploaded_by?.username}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Property Agent
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {property.uploaded_by?.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {property.uploaded_by?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-sm">
                          {property.uploaded_by?.city},{" "}
                          {property.uploaded_by?.state}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      Login to view contact details.
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4">
                  {isAuthenticated ? (
                    <>
                      <Button className="w-full" size="lg">
                        <Phone className="h-5 w-5 mr-2" />
                        Call Agent
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        <Mail className="h-5 w-5 mr-2" />
                        Email Agent
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() =>
                        router.push(`/login?redirect=/property/${id}`)
                      }
                    >
                      Login to Contact
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
