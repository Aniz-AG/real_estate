import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { searchProperties } from '@/redux/slices/propertySlice';
import {
    Bed, Bath, Maximize, MapPin, Search, Filter, Loader2,
    X, ChevronDown, SlidersHorizontal, Grid3X3, List,
    ArrowRight, Building2, Home as HomeIcon, Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } }
};

export default function BrowseProperty() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { properties, loading } = useSelector((state) => state.property);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid');
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const [filters, setFilters] = useState({
        city: router.query.city || '',
        state: '',
        property_type: '',
        usage_type: '',
        minPrice: '',
        maxPrice: '',
        bedrooms: '',
        bathrooms: '',
        status: 'available',
    });

    useEffect(() => {
        handleSearch();
    }, []);

    useEffect(() => {
        // Count active filters
        let count = 0;
        if (filters.city) count++;
        if (filters.state) count++;
        if (filters.property_type) count++;
        if (filters.usage_type) count++;
        if (filters.minPrice) count++;
        if (filters.maxPrice) count++;
        if (filters.bedrooms) count++;
        if (filters.bathrooms) count++;
        setActiveFiltersCount(count);
    }, [filters]);

    const handleChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        dispatch(searchProperties(filters));
        setMobileFiltersOpen(false);
    };

    const handleReset = () => {
        setFilters({
            city: '',
            state: '',
            property_type: '',
            usage_type: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: '',
            status: 'available',
        });
        dispatch(searchProperties({}));
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const quickFilters = [
        { label: 'Apartments', value: 'apartment', key: 'property_type' },
        { label: 'Houses', value: 'house', key: 'property_type' },
        { label: 'Villas', value: 'villa', key: 'property_type' },
        { label: 'For Rent', value: 'rent', key: 'usage_type' },
        { label: 'For Sale', value: 'sale', key: 'usage_type' },
    ];

    const FilterPanel = ({ className = '' }) => (
        <div className={className}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5 text-primary" />
                    Filters
                </h2>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-primary hover:text-primary/80">
                    Reset All
                </Button>
            </div>

            <form onSubmit={handleSearch} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">City</Label>
                    <Input
                        id="city"
                        name="city"
                        placeholder="Enter city"
                        value={filters.city}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">State</Label>
                    <Input
                        id="state"
                        name="state"
                        placeholder="Enter state"
                        value={filters.state}
                        onChange={handleChange}
                        className="h-11 rounded-lg border-gray-200 focus:border-primary focus:ring-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="property_type" className="text-sm font-medium">Property Type</Label>
                    <div className="relative">
                        <select
                            id="property_type"
                            name="property_type"
                            value={filters.property_type}
                            onChange={handleChange}
                            className="w-full h-11 rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="">All Types</option>
                            <option value="apartment">Apartment</option>
                            <option value="house">House</option>
                            <option value="villa">Villa</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="usage_type" className="text-sm font-medium">For</Label>
                    <div className="relative">
                        <select
                            id="usage_type"
                            name="usage_type"
                            value={filters.usage_type}
                            onChange={handleChange}
                            className="w-full h-11 rounded-lg border border-gray-200 bg-background px-3 py-2 text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        >
                            <option value="">Rent or Sale</option>
                            <option value="rent">Rent</option>
                            <option value="sale">Sale</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">Price Range</Label>
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            type="number"
                            name="minPrice"
                            placeholder="Min ₹"
                            value={filters.minPrice}
                            onChange={handleChange}
                            className="h-11 rounded-lg border-gray-200"
                        />
                        <Input
                            type="number"
                            name="maxPrice"
                            placeholder="Max ₹"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            className="h-11 rounded-lg border-gray-200"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <Label htmlFor="bedrooms" className="text-sm font-medium">Bedrooms</Label>
                        <Input
                            type="number"
                            id="bedrooms"
                            name="bedrooms"
                            placeholder="Min"
                            value={filters.bedrooms}
                            onChange={handleChange}
                            min="1"
                            className="h-11 rounded-lg border-gray-200"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="bathrooms" className="text-sm font-medium">Bathrooms</Label>
                        <Input
                            type="number"
                            id="bathrooms"
                            name="bathrooms"
                            placeholder="Min"
                            value={filters.bathrooms}
                            onChange={handleChange}
                            min="1"
                            className="h-11 rounded-lg border-gray-200"
                        />
                    </div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                        type="submit"
                        className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5 mr-2" />
                        )}
                        {loading ? 'Searching...' : 'Search Properties'}
                    </Button>
                </motion.div>
            </form>
        </div>
    );

    return (
        <Layout>
            <SeoHead
                title="Browse Properties - EstateHub"
                description="Search apartments, villas, and houses by city, price, bedrooms, and more. Find your dream property today."
            />

            {/* Hero Section */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-primary" />
                <motion.div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="text-center text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4 border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            {properties?.length || 0} Properties Available
                        </motion.span>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Browse Properties
                        </h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl mx-auto">
                            Find your perfect home from our extensive collection
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Quick Filters */}
            <section className="bg-white border-b sticky top-16 z-30">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <Button
                            variant="outline"
                            className="lg:hidden shrink-0 rounded-lg"
                            onClick={() => setMobileFiltersOpen(true)}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="ml-2 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </Button>

                        <div className="hidden lg:flex items-center gap-2">
                            {quickFilters.map((qf, idx) => (
                                <motion.button
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setFilters({ ...filters, [qf.key]: filters[qf.key] === qf.value ? '' : qf.value });
                                        setTimeout(() => dispatch(searchProperties({ ...filters, [qf.key]: filters[qf.key] === qf.value ? '' : qf.value })), 100);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filters[qf.key] === qf.value
                                            ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                            : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {qf.label}
                                </motion.button>
                            ))}
                        </div>

                        <div className="ml-auto flex items-center gap-2 shrink-0">
                            <span className="text-sm text-muted-foreground hidden sm:block">View:</span>
                            <div className="flex border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <Grid3X3 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                                >
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <div className="lg:grid lg:grid-cols-4 lg:gap-8">
                    {/* Desktop Filters Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <Card className="sticky top-36 border-0 shadow-lg">
                            <CardContent className="p-6">
                                <FilterPanel />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Mobile Filters Drawer */}
                    <AnimatePresence>
                        {mobileFiltersOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                                    onClick={() => setMobileFiltersOpen(false)}
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'tween', duration: 0.3 }}
                                    className="fixed inset-y-0 left-0 w-80 max-w-full bg-white z-50 lg:hidden shadow-2xl"
                                >
                                    <div className="flex items-center justify-between p-4 border-b">
                                        <h2 className="text-lg font-bold">Filters</h2>
                                        <button
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="p-2 hover:bg-gray-100 rounded-lg"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
                                        <FilterPanel />
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Properties Grid */}
                    <div className="lg:col-span-3">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-bold">
                                <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    {properties?.length || 0} Properties Found
                                </span>
                            </h2>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mb-4"
                                />
                                <p className="text-muted-foreground">Searching properties...</p>
                            </div>
                        ) : properties && properties.length > 0 ? (
                            <motion.div
                                className={viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                    : "space-y-4"
                                }
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                            >
                                {properties.map((property, idx) => (
                                    <PropertyCard
                                        key={property._id}
                                        property={property}
                                        viewMode={viewMode}
                                        index={idx}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <Card className="border-0 shadow-lg">
                                    <CardContent className="p-12 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring" }}
                                            className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                                        >
                                            <Building2 className="h-10 w-10 text-gray-400" />
                                        </motion.div>
                                        <h3 className="text-xl font-bold mb-2">No properties found</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Try adjusting your filters or search criteria
                                        </p>
                                        <Button onClick={handleReset} variant="outline">
                                            Reset Filters
                                        </Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

function PropertyCard({ property, viewMode = 'grid', index = 0 }) {
    const router = useRouter();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (viewMode === 'list') {
        return (
            <motion.div
                variants={fadeInUp}
                whileHover={{ y: -2 }}
            >
                <Card
                    className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                    onClick={() => router.push(`/property/${property._id}`)}
                >
                    <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-64 h-48 sm:h-auto shrink-0 overflow-hidden">
                            <motion.img
                                src={property.photos[0]?.url || '/placeholder-property.jpg'}
                                alt={property.address.property_address}
                                className="w-full h-full object-cover"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                            />
                            <div className="absolute top-3 left-3">
                                <span className="bg-gradient-to-r from-primary to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold capitalize shadow-lg">
                                    For {property.usage_type}
                                </span>
                            </div>
                        </div>
                        <CardContent className="flex-1 p-5">
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{property.address.property_address}</h3>
                                    <p className="text-muted-foreground mb-3 flex items-center gap-1">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        {property.address.city}, {property.address.state}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                            <Bed className="h-4 w-4" />
                                            {property.nums_bedrooms} Beds
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                            <Bath className="h-4 w-4" />
                                            {property.nums_bathrooms} Baths
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                                            <Maximize className="h-4 w-4" />
                                            {property.square_feet} sqft
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                        {formatPrice(property.price)}
                                    </span>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button size="sm" className="rounded-lg shadow-md">
                                            View Details
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </div>
                </Card>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={scaleIn}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card
                className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden bg-white h-full"
                onClick={() => router.push(`/property/${property._id}`)}
            >
                <div className="relative h-52 overflow-hidden">
                    <motion.img
                        src={property.photos[0]?.url || '/placeholder-property.jpg'}
                        alt={property.address.property_address}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3">
                        <motion.span
                            className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold capitalize shadow-lg"
                            whileHover={{ scale: 1.05 }}
                        >
                            For {property.usage_type}
                        </motion.span>
                    </div>
                    <motion.div
                        className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ y: 10 }}
                        whileHover={{ y: 0 }}
                    >
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Bed className="h-3 w-3" /> {property.nums_bedrooms}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Bath className="h-3 w-3" /> {property.nums_bathrooms}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Maximize className="h-3 w-3" /> {property.square_feet}
                        </span>
                    </motion.div>
                </div>
                <CardContent className="p-5">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.address.property_address}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                        {property.address.city}, {property.address.state}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                            {formatPrice(property.price)}
                        </span>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" className="rounded-lg shadow-md">
                                View
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
