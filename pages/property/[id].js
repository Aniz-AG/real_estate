import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bed, Bath, Maximize, MapPin, Heart, Phone, Mail, Share2 } from 'lucide-react';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

export default function PropertyDetails() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

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
            toast.error('Failed to load property');
            router.push('/browse');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to save properties');
            router.push('/login');
            return;
        }

        try {
            await axios.post(`/api/user/like/${id}/${user._id}`);
            setIsLiked(!isLiked);
            toast.success(isLiked ? 'Removed from favorites' : 'Added to favorites');
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
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
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.address?.property_address,
        description: property.description,
        url: canonical,
        image: property.photos?.map((photo) => photo.url).filter(Boolean),
        numberOfRooms: property.nums_bedrooms,
        numberOfBathroomsTotal: property.nums_bathrooms,
        floorSize: {
            '@type': 'QuantitativeValue',
            value: property.square_feet,
            unitText: 'SQFT',
        },
        address: {
            '@type': 'PostalAddress',
            streetAddress: property.address?.property_address,
            addressLocality: property.address?.city,
            addressRegion: property.address?.state,
            postalCode: property.address?.pincode,
            addressCountry: 'IN',
        },
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'INR',
            availability: property.status === 'available'
                ? 'https://schema.org/InStock'
                : 'https://schema.org/PreOrder',
        },
        seller: property.uploaded_by && {
            '@type': 'RealEstateAgent',
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
                            src={property.photos[currentImageIndex]?.url || '/placeholder-property.jpg'}
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
                                <img src={photo.url} alt={`Property ${index + 2}`} className="w-full h-full object-cover" />
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
                                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">{property.address.property_address}</h1>
                                    <p className="text-lg text-muted-foreground flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        {property.address.city}, {property.address.state} - {property.address.pincode}
                                    </p>
                                </div>
                                <Button
                                    variant={isLiked ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={handleLike}
                                    className="h-11 w-11 sm:h-12 sm:w-12"
                                >
                                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
                                </Button>
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
                                        <p className="text-2xl font-bold">{property.nums_bedrooms}</p>
                                        <p className="text-sm text-muted-foreground">Bedrooms</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <Bath className="h-8 w-8 mx-auto mb-2 text-primary" />
                                        <p className="text-2xl font-bold">{property.nums_bathrooms}</p>
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
                                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                            </CardContent>
                        </Card>
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
                                        <h3 className="font-bold text-lg">{property.uploaded_by?.username}</h3>
                                        <p className="text-sm text-muted-foreground">Property Agent</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {isAuthenticated ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <Phone className="h-5 w-5 text-primary" />
                                                <span className="text-sm">{property.uploaded_by?.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Mail className="h-5 w-5 text-primary" />
                                                <span className="text-sm">{property.uploaded_by?.email}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <MapPin className="h-5 w-5 text-primary" />
                                                <span className="text-sm">
                                                    {property.uploaded_by?.city}, {property.uploaded_by?.state}
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
                                        <Button className="w-full" size="lg" onClick={() => router.push(`/login?redirect=/property/${id}`)}>
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
