import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Button } from '@/components/ui/button';
import { searchProperties, setSelectedCity } from '@/redux/slices/propertySlice';
import {
    Bed, Bath, Maximize, MapPin, Search, Loader2,
    X, ChevronDown, ChevronUp, Grid3X3, List,
    ArrowRight, Building2, Home as HomeIcon, Heart,
    Share2, Phone, Filter, Check, SlidersHorizontal,
    Calendar, Layers
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Filter Options Data
const FILTER_OPTIONS = {
    propertyTypes: {
        residential: [
            { label: 'Flat', value: 'flat' },
            { label: 'House/Villa', value: 'villa' },
            { label: 'Plot', value: 'plot' },
            { label: 'Builder Floor', value: 'builder_floor' },
            { label: 'Penthouse', value: 'penthouse' },
            { label: 'Studio Apartment', value: 'studio_apartment' },
        ],
        commercial: [
            { label: 'Office Space', value: 'office_space' },
            { label: 'Shop/Showroom', value: 'shop' },
            { label: 'Commercial Land', value: 'commercial_land' },
            { label: 'Warehouse/Godown', value: 'warehouse' },
            { label: 'Industrial Building', value: 'industrial_building' },
        ],
    },
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5+ BHK'],
    budgetOptions: {
        min: [
            { label: 'Min', value: '' },
            { label: '₹5 Lac', value: '500000' },
            { label: '₹10 Lac', value: '1000000' },
            { label: '₹20 Lac', value: '2000000' },
            { label: '₹30 Lac', value: '3000000' },
            { label: '₹50 Lac', value: '5000000' },
            { label: '₹1 Cr', value: '10000000' },
            { label: '₹2 Cr', value: '20000000' },
        ],
        max: [
            { label: 'Max', value: '' },
            { label: '₹10 Lac', value: '1000000' },
            { label: '₹30 Lac', value: '3000000' },
            { label: '₹50 Lac', value: '5000000' },
            { label: '₹1 Cr', value: '10000000' },
            { label: '₹2 Cr', value: '20000000' },
            { label: '₹5 Cr', value: '50000000' },
        ]
    },
    areaOptions: {
        min: [
            { label: 'Min', value: '' },
            { label: '500 sqft', value: '500' },
            { label: '1000 sqft', value: '1000' },
            { label: '1500 sqft', value: '1500' },
            { label: '2000 sqft', value: '2000' },
            { label: '3000 sqft', value: '3000' },
        ],
        max: [
            { label: 'Max', value: '' },
            { label: '1000 sqft', value: '1000' },
            { label: '2000 sqft', value: '2000' },
            { label: '3000 sqft', value: '3000' },
            { label: '5000 sqft', value: '5000' },
        ]
    },
    possessionStatus: [
        { label: 'Ready To Move', value: 'ready_to_move' },
        { label: 'Under Construction', value: 'under_construction' },
    ],
    saleType: [
        { label: 'New', value: 'new' },
        { label: 'Resale', value: 'resale' },
    ],
    postedSince: [
        { label: 'All', value: '' },
        { label: 'Yesterday', value: '1' },
        { label: 'Last Week', value: '7' },
        { label: 'Last 2 Weeks', value: '14' },
        { label: 'Last Month', value: '30' },
        { label: 'Last 2 Months', value: '60' },
    ],
    postedBy: [
        { label: 'Owners', value: 'owner' },
        { label: 'Agents', value: 'agent' },
        { label: 'Builders', value: 'builder' },
    ],
    ownership: [
        { label: 'Freehold', value: 'freehold' },
        { label: 'Leasehold', value: 'leasehold' },
        { label: 'Power Of Attorney', value: 'power_of_attorney' },
        { label: 'Co-operative Society', value: 'cooperative_society' },
    ],
    furnishing: [
        { label: 'Furnished', value: 'furnished' },
        { label: 'Semi-Furnished', value: 'semi_furnished' },
        { label: 'Unfurnished', value: 'unfurnished' },
    ],
    amenities: [
        { label: 'Reserved Parking', value: 'reserved_parking' },
        { label: 'Lift', value: 'lift' },
        { label: 'Power Back Up', value: 'power_backup' },
        { label: 'Piped Gas', value: 'gas_pipeline' },
        { label: 'Park', value: 'park' },
        { label: 'Kids play area', value: 'kids_play_area' },
        { label: 'Gymnasium', value: 'gymnasium' },
        { label: 'Swimming Pool', value: 'swimming_pool' },
        { label: 'Club House', value: 'club_house' },
        { label: 'Security', value: 'security' },
        { label: 'CCTV', value: 'cctv' },
        { label: 'Fire Safety', value: 'fire_safety' },
    ],
    facing: [
        { label: 'East', value: 'east' },
        { label: 'North', value: 'north' },
        { label: 'North - East', value: 'north-east' },
        { label: 'North - West', value: 'north-west' },
        { label: 'South', value: 'south' },
        { label: 'South - East', value: 'south-east' },
        { label: 'South - West', value: 'south-west' },
        { label: 'West', value: 'west' },
    ],
    floor: [
        { label: 'Basement', value: 'basement' },
        { label: 'Ground', value: 'ground' },
        { label: '1-4', value: '1-4' },
        { label: '5-8', value: '5-8' },
        { label: '9-12', value: '9-12' },
        { label: '13-16', value: '13-16' },
        { label: '16+', value: '16+' },
    ],
    bathrooms: ['1', '2', '3', '4', '5'],
};

export default function BrowseProperty() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { properties, loading, selectedCity } = useSelector((state) => state.property);
    const { isAuthenticated } = useSelector((state) => state.user);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list');
    const [sortBy, setSortBy] = useState('relevance');
    const [activeTab, setActiveTab] = useState('properties');

    // Filter states
    const [filters, setFilters] = useState({
        city: '',
        propertyTypes: [],
        bhkTypes: [],
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        possessionStatus: [],
        saleType: [],
        postedSince: '',
        postedBy: [],
        ownership: [],
        furnishing: [],
        amenities: [],
        facing: [],
        floor: [],
        bathrooms: [],
        hasPhotos: false,
        hasVideos: false,
        verifiedOnly: false,
    });

    // Dropdown states
    const [openDropdown, setOpenDropdown] = useState(null);
    const [budgetTab, setBudgetTab] = useState('min');
    const [expandedFilters, setExpandedFilters] = useState({
        coveredArea: true,
        possessionStatus: true,
        subPropertyType: true,
        saleType: true,
        postedSince: true,
        postedBy: true,
        ownership: true,
        furnishing: true,
        amenities: false,
        photosVideos: true,
        facing: false,
        floor: false,
        bathroom: false,
    });
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const dropdownRef = useRef(null);
    const prevSelectedCityRef = useRef(selectedCity);

    // Initialize filters from URL on first load
    useEffect(() => {
        const query = router.query;
        const cityFromQuery = query.city || selectedCity || '';

        setFilters(prev => ({
            ...prev,
            city: cityFromQuery,
            propertyTypes: query.type ? query.type.split(',') : [],
            bhkTypes: query.bhk ? query.bhk.split(',') : [],
            minPrice: query.minPrice || '',
            maxPrice: query.maxPrice || '',
        }));

        // Sync redux selectedCity with URL city
        if (query.city && query.city !== selectedCity) {
            dispatch(setSelectedCity(query.city));
        }
    }, [router.query]);

    // Listen for selectedCity changes from Redux (header dropdown)
    useEffect(() => {
        if (selectedCity && selectedCity !== prevSelectedCityRef.current) {
            setFilters(prev => ({
                ...prev,
                city: selectedCity,
            }));
            prevSelectedCityRef.current = selectedCity;
        }
    }, [selectedCity]);

    // Trigger search on initial load and when filters.city changes
    useEffect(() => {
        if (filters.city || initialLoad) {
            handleSearch();
            setInitialLoad(false);
        }
    }, [filters.city]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const shouldLock = moreFiltersOpen || mobileFiltersOpen;
        document.body.style.overflow = shouldLock ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [moreFiltersOpen, mobileFiltersOpen]);

    const normalizeCity = (value) => (value || '').toString().trim().toLowerCase();
    const effectiveCity = (filters.city || selectedCity || '').trim();

    const handleSearch = async () => {
        const searchFilters = {
            city: effectiveCity,
            property_type: filters.propertyTypes.join(','),
            bhk_type: filters.bhkTypes.join(','),
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            minArea: filters.minArea,
            maxArea: filters.maxArea,
            possession_status: filters.possessionStatus.join(','),
            sale_type: filters.saleType.join(','),
            posted_since: filters.postedSince,
            posted_by: filters.postedBy.join(','),
            ownership: filters.ownership.join(','),
            furnishing: filters.furnishing.join(','),
            amenities: filters.amenities.join(','),
            facing: filters.facing.join(','),
            floor: filters.floor.join(','),
            bathrooms: filters.bathrooms.join(','),
            has_photos: filters.hasPhotos,
            has_videos: filters.hasVideos,
            verified_only: filters.verifiedOnly,
            sort_by: sortBy,
        };
        dispatch(searchProperties(searchFilters));
        setMobileFiltersOpen(false);
        setMoreFiltersOpen(false);
    };

    const handleClearAll = () => {
        setFilters({
            city: filters.city,
            propertyTypes: [],
            bhkTypes: [],
            minPrice: '',
            maxPrice: '',
            minArea: '',
            maxArea: '',
            possessionStatus: [],
            saleType: [],
            postedSince: '',
            postedBy: [],
            ownership: [],
            furnishing: [],
            amenities: [],
            facing: [],
            floor: [],
            bathrooms: [],
            hasPhotos: false,
            hasVideos: false,
            verifiedOnly: false,
        });
    };

    const toggleArrayFilter = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: prev[filterName].includes(value)
                ? prev[filterName].filter(v => v !== value)
                : [...prev[filterName], value]
        }));
    };

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lac`;
        return `₹${price.toLocaleString('en-IN')}`;
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.propertyTypes.length > 0) count++;
        if (filters.bhkTypes.length > 0) count++;
        if (filters.minPrice || filters.maxPrice) count++;
        if (filters.minArea || filters.maxArea) count++;
        if (filters.possessionStatus.length > 0) count++;
        if (filters.saleType.length > 0) count++;
        if (filters.postedSince) count++;
        if (filters.postedBy.length > 0) count++;
        if (filters.ownership.length > 0) count++;
        if (filters.furnishing.length > 0) count++;
        if (filters.amenities.length > 0) count++;
        if (filters.facing.length > 0) count++;
        if (filters.floor.length > 0) count++;
        if (filters.bathrooms.length > 0) count++;
        if (filters.hasPhotos) count++;
        if (filters.hasVideos) count++;
        if (filters.verifiedOnly) count++;
        return count;
    };

    // Toggle Chip Component
    const ToggleChip = ({ label, selected, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${selected
                ? 'bg-red-50 border-primary text-primary'
                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
        >
            {!selected && <span className="text-gray-400 mr-1">+</span>}
            {selected && <Check className="inline h-3 w-3 mr-1" />}
            {label}
        </button>
    );

    // Collapsible Filter Section
    const FilterSection = ({ title, name, children, hasActiveFilters }) => (
        <div className="border-b border-gray-100 py-3">
            <button
                onClick={() => setExpandedFilters(prev => ({ ...prev, [name]: !prev[name] }))}
                className="w-full flex items-center justify-between text-left"
            >
                <span className="font-medium text-gray-800 flex items-center">
                    {title}
                    {hasActiveFilters && <span className="ml-2 w-2 h-2 bg-primary rounded-full" />}
                </span>
                {expandedFilters[name] ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            <AnimatePresence>
                {expandedFilters[name] && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-3">{children}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    // Property Card Component - Magic Bricks Style
    const PropertyCard = ({ property }) => {
        const mainImage = property.photos?.[0]?.url || '/placeholder-property.jpg';
        const photoCount = property.photos?.length || 0;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
                <div className={`flex ${viewMode === 'list' ? 'flex-col md:flex-row' : 'flex-col'}`}>
                    <div className={`relative ${viewMode === 'list' ? 'w-full md:w-72 h-52 md:h-48' : 'w-full h-48'}`}>
                        <Link href={`/property/${property._id}`}>
                            <img src={mainImage} alt={property.title || 'Property'} className="w-full h-full object-cover" />
                        </Link>
                        {photoCount > 1 && (
                            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                {photoCount}+ Photos
                            </div>
                        )}
                        <div className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                            Posted: {new Date(property.createdAt).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="flex-1 p-4">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                            <div className="flex-1">
                                <Link href={`/property/${property._id}`}>
                                    <h3 className="text-base font-semibold text-gray-800 hover:text-primary">
                                        {property.bhk_type && `${property.bhk_type} `}
                                        {property.property_type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} for {property.usage_type === 'rent' ? 'Rent' : 'Sale'} in {property.address?.locality || property.address?.city}
                                    </h3>
                                </Link>
                                {property.project_name && (
                                    <p className="text-sm text-primary mt-1">{property.project_name}</p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1 md:border-r md:border-gray-200 md:pr-6">
                                        <Maximize className="h-4 w-4" />
                                        <div>
                                            <div className="text-xs text-gray-400">SUPER AREA</div>
                                            <div className="font-medium">{property.covered_area || property.square_feet} sqft</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 md:border-r md:border-gray-200 md:pr-6">
                                        <Calendar className="h-4 w-4" />
                                        <div>
                                            <div className="text-xs text-gray-400">STATUS</div>
                                            <div className="font-medium">
                                                {property.possession_status === 'ready_to_move' ? 'Ready to Move' :
                                                    property.possession_status === 'under_construction' ? 'Under Construction' : 'Available'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Layers className="h-4 w-4" />
                                        <div>
                                            <div className="text-xs text-gray-400">FLOOR</div>
                                            <div className="font-medium">{property.floor_number || 'N/A'}</div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                                    {property.facing && `${property.facing.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Facing, `}
                                    {property.furnishing && `${property.furnishing.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}, `}
                                    {property.nums_bedrooms} Bedrooms, {property.nums_bathrooms} Bathrooms
                                </p>
                            </div>

                            <div className="text-left md:text-right md:ml-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <Heart className="h-5 w-5 text-gray-400" />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-gray-100">
                                        <Share2 className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                                <div className="text-xl font-bold text-gray-900">{formatPrice(property.price)}</div>
                                {property.price_per_sqft && (
                                    <div className="text-sm text-gray-500">₹{property.price_per_sqft.toLocaleString()} per sqft</div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <Building2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium">{property.builder_name || 'Property Owner'}</div>
                                    <div className="text-xs text-gray-500">
                                        {property.posted_by_type?.replace(/\b\w/g, l => l.toUpperCase()) || 'Owner'}
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                {isAuthenticated ? (
                                    <>
                                        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">Contact Agent</Button>
                                        <Button variant="outline" className="border-primary text-primary hover:bg-red-50 w-full sm:w-auto">
                                            <Phone className="h-4 w-4 mr-1" />Get Phone No.
                                        </Button>
                                    </>
                                ) : (
                                    <Link href={`/login?redirect=/property/${property._id}`} className="w-full sm:w-auto">
                                        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
                                            Login to Contact
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <Layout>
            <SeoHead
                title={`Properties for Sale in ${filters.city || 'India'} | EstateHub`}
                description={`Find ${properties?.length || 0}+ properties for sale in ${filters.city || 'India'}.`}
            />

            {/* Top Search Bar */}
            <div className="bg-primary sticky top-0 z-40 overflow-visible">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 bg-white rounded-2xl md:rounded-full px-4 py-2 shadow-lg overflow-visible" ref={dropdownRef}>
                        <button className="flex items-center justify-between md:justify-start gap-2 text-sm font-medium text-gray-700 hover:text-primary px-3 py-2 rounded-xl md:rounded-full w-full md:w-auto">
                            Buy <ChevronDown className="h-4 w-4" />
                        </button>

                        <div className="flex items-center gap-2 bg-gray-100 rounded-xl md:rounded-full px-3 py-2 w-full md:w-auto">
                            <span className="text-sm font-medium">{filters.city || 'Select City'}</span>
                            {filters.city && (
                                <button onClick={() => setFilters(prev => ({ ...prev, city: '' }))} className="hover:bg-gray-200 rounded-full p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>

                        <input type="text" placeholder="Add More..." className="w-full md:flex-1 text-sm border border-gray-200 md:border-none rounded-xl md:rounded-none px-3 py-2 focus:outline-none" />

                        <div className="hidden md:block border-l border-gray-200 h-8" />

                        <button
                            onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                            className="flex items-center justify-between md:justify-start gap-2 text-sm font-medium text-gray-700 hover:text-primary px-3 py-2 border border-gray-200 rounded-xl md:rounded-lg w-full md:w-auto"
                        >
                            Budget <ChevronDown className="h-4 w-4" />
                        </button>

                        {filters.propertyTypes.length > 0 && (
                            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm">
                                {filters.propertyTypes[0].replace(/_/g, ' ')}
                                {filters.propertyTypes.length > 1 && <span className="text-gray-500">+{filters.propertyTypes.length - 1}</span>}
                                <button onClick={() => setFilters(prev => ({ ...prev, propertyTypes: [] }))} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        {filters.bhkTypes.length > 0 && (
                            <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1.5 text-sm">
                                {filters.bhkTypes.join(', ')}
                                <button onClick={() => setFilters(prev => ({ ...prev, bhkTypes: [] }))} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}

                        <button onClick={() => setMoreFiltersOpen(true)} className="flex items-center gap-2 text-sm font-medium text-primary px-3 py-2 border border-primary rounded-lg hover:bg-red-50">
                            {getActiveFiltersCount() > 0 && (
                                <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {getActiveFiltersCount()}
                                </span>
                            )}
                            More Filters <ChevronDown className="h-4 w-4" />
                        </button>
                    </div>

                    <AnimatePresence>
                        {openDropdown === 'budget' && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute left-0 right-0 md:right-0 md:left-auto mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-[9999]"
                                style={{ minWidth: '300px' }}
                            >
                                <div className="flex border-b border-gray-200 mb-3">
                                    <button onClick={() => setBudgetTab('min')} className={`flex-1 pb-2 text-sm font-medium ${budgetTab === 'min' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
                                        Min Price
                                    </button>
                                    <button onClick={() => setBudgetTab('max')} className={`flex-1 pb-2 text-sm font-medium ${budgetTab === 'max' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}>
                                        Max Price
                                    </button>
                                </div>
                                <div>
                                    {(budgetTab === 'min' ? FILTER_OPTIONS.budgetOptions.min : FILTER_OPTIONS.budgetOptions.max).map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                if (budgetTab === 'min') setFilters(prev => ({ ...prev, minPrice: option.value }));
                                                else setFilters(prev => ({ ...prev, maxPrice: option.value }));
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded ${(budgetTab === 'min' ? filters.minPrice : filters.maxPrice) === option.value ? 'bg-red-50 text-primary' : ''
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-2">
                    <div className="text-sm text-gray-500">
                        <Link href="/" className="hover:text-primary">Home</Link>
                        <span className="mx-2">›</span>
                        <span>Properties for Sale in {effectiveCity || 'India'}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex gap-6">
                        {/* Left Sidebar */}
                        <div className="hidden lg:block w-72 flex-shrink-0">
                            <div className="bg-white rounded-lg border border-gray-200 sticky top-24">
                                <div className="flex border-b border-gray-200">
                                    <button onClick={() => setActiveTab('properties')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'properties' ? 'text-primary border-b-2 border-primary bg-red-50' : 'text-gray-600'}`}>
                                        Properties ({(effectiveCity ? properties?.filter(p => normalizeCity(p?.address?.city) === normalizeCity(effectiveCity)) : properties)?.length || 0})
                                    </button>
                                    <button onClick={() => setActiveTab('projects')} className={`flex-1 py-3 text-sm font-medium ${activeTab === 'projects' ? 'text-primary border-b-2 border-primary bg-red-50' : 'text-gray-600'}`}>
                                        New Projects
                                    </button>
                                </div>

                                <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                                    <FilterSection title="Covered Area" name="coveredArea" hasActiveFilters={filters.minArea || filters.maxArea}>
                                        <div className="flex items-center gap-2">
                                            <select value={filters.minArea} onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                                {FILTER_OPTIONS.areaOptions.min.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                            <span className="text-gray-400">to</span>
                                            <select value={filters.maxArea} onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                                {FILTER_OPTIONS.areaOptions.max.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Possession Status" name="possessionStatus" hasActiveFilters={filters.possessionStatus.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.possessionStatus.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.possessionStatus.includes(option.value)} onClick={() => toggleArrayFilter('possessionStatus', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Sub Property Type" name="subPropertyType" hasActiveFilters={filters.propertyTypes.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.propertyTypes.residential.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.propertyTypes.includes(option.value)} onClick={() => toggleArrayFilter('propertyTypes', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Sale Type" name="saleType" hasActiveFilters={filters.saleType.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.saleType.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.saleType.includes(option.value)} onClick={() => toggleArrayFilter('saleType', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Posted Since" name="postedSince" hasActiveFilters={!!filters.postedSince}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.postedSince.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.postedSince === option.value} onClick={() => setFilters(prev => ({ ...prev, postedSince: option.value }))} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Posted By" name="postedBy" hasActiveFilters={filters.postedBy.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.postedBy.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.postedBy.includes(option.value)} onClick={() => toggleArrayFilter('postedBy', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Ownership" name="ownership" hasActiveFilters={filters.ownership.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.ownership.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.ownership.includes(option.value)} onClick={() => toggleArrayFilter('ownership', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Furnishing" name="furnishing" hasActiveFilters={filters.furnishing.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.furnishing.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.furnishing.includes(option.value)} onClick={() => toggleArrayFilter('furnishing', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Amenities" name="amenities" hasActiveFilters={filters.amenities.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {(showAllAmenities ? FILTER_OPTIONS.amenities : FILTER_OPTIONS.amenities.slice(0, 6)).map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.amenities.includes(option.value)} onClick={() => toggleArrayFilter('amenities', option.value)} />
                                            ))}
                                        </div>
                                        {FILTER_OPTIONS.amenities.length > 6 && (
                                            <button onClick={() => setShowAllAmenities(!showAllAmenities)} className="text-primary text-sm mt-2">
                                                {showAllAmenities ? 'Show Less' : `+ ${FILTER_OPTIONS.amenities.length - 6} more`}
                                            </button>
                                        )}
                                    </FilterSection>

                                    <div className="py-3 flex items-center justify-between">
                                        <span className="font-medium text-gray-800">Verified Properties</span>
                                        <button onClick={() => setFilters(prev => ({ ...prev, verifiedOnly: !prev.verifiedOnly }))} className={`w-12 h-6 rounded-full transition-colors ${filters.verifiedOnly ? 'bg-primary' : 'bg-gray-200'}`}>
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${filters.verifiedOnly ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                        </button>
                                    </div>

                                    <FilterSection title="Facing" name="facing" hasActiveFilters={filters.facing.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.facing.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.facing.includes(option.value)} onClick={() => toggleArrayFilter('facing', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Floor" name="floor" hasActiveFilters={filters.floor.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.floor.map(option => (
                                                <ToggleChip key={option.value} label={option.label} selected={filters.floor.includes(option.value)} onClick={() => toggleArrayFilter('floor', option.value)} />
                                            ))}
                                        </div>
                                    </FilterSection>

                                    <FilterSection title="Bathroom" name="bathroom" hasActiveFilters={filters.bathrooms.length > 0}>
                                        <div className="flex flex-wrap gap-2">
                                            {FILTER_OPTIONS.bathrooms.map(option => (
                                                <ToggleChip key={option} label={option} selected={filters.bathrooms.includes(option)} onClick={() => toggleArrayFilter('bathrooms', option)} />
                                            ))}
                                        </div>
                                    </FilterSection>
                                </div>

                                <div className="p-4 border-t border-gray-200 flex gap-3">
                                    <button onClick={handleClearAll} className="flex-1 py-2 text-primary font-medium hover:bg-red-50 rounded-lg">Clear All</button>
                                    <Button onClick={handleSearch} className="flex-1 bg-primary hover:bg-primary/90">View {properties?.length || 0} Properties</Button>
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-800">
                                        {(effectiveCity ? properties?.filter(p => normalizeCity(p?.address?.city) === normalizeCity(effectiveCity)) : properties)?.length || 0} results | Properties for Sale in {effectiveCity || 'India'}
                                    </h1>
                                    <button className="text-sm text-primary flex items-center gap-1 mt-1">
                                        <MapPin className="h-4 w-4" />Add Localities for more relevant results<ArrowRight className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="text-gray-500">Sort by:</span>
                                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2">
                                            <option value="relevance">Relevance</option>
                                            <option value="price_low">Price: Low to High</option>
                                            <option value="price_high">Price: High to Low</option>
                                            <option value="newest">Newest First</option>
                                        </select>
                                    </div>
                                    <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                                        <button onClick={() => setViewMode('list')} className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                                            <List className="h-5 w-5" />
                                        </button>
                                        <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                                            <Grid3X3 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:hidden mb-4">
                                <Button onClick={() => setMobileFiltersOpen(true)} variant="outline" className="w-full">
                                    <Filter className="h-4 w-4 mr-2" />Filters
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{getActiveFiltersCount()}</span>
                                    )}
                                </Button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center py-20">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : (effectiveCity ? properties?.filter(p => normalizeCity(p?.address?.city) === normalizeCity(effectiveCity)) : properties)?.length === 0 ? (
                                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Properties Found</h3>
                                    <p className="text-gray-500 mb-4">Try adjusting your filters to find more properties</p>
                                    <Button onClick={handleClearAll} variant="outline">Clear All Filters</Button>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'}>
                                    {(effectiveCity ? properties?.filter(p => normalizeCity(p?.address?.city) === normalizeCity(effectiveCity)) : properties)?.map((property) => (
                                        <PropertyCard key={property._id} property={property} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right Sidebar removed to prevent overflow */}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 lg:hidden overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <button onClick={() => setMobileFiltersOpen(false)}><X className="h-6 w-6" /></button>
                            </div>
                            <div className="p-4">
                                <FilterSection title="Possession Status" name="possessionStatus" hasActiveFilters={filters.possessionStatus.length > 0}>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_OPTIONS.possessionStatus.map(option => (
                                            <ToggleChip key={option.value} label={option.label} selected={filters.possessionStatus.includes(option.value)} onClick={() => toggleArrayFilter('possessionStatus', option.value)} />
                                        ))}
                                    </div>
                                </FilterSection>
                                <FilterSection title="Property Type" name="subPropertyType" hasActiveFilters={filters.propertyTypes.length > 0}>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_OPTIONS.propertyTypes.residential.map(option => (
                                            <ToggleChip key={option.value} label={option.label} selected={filters.propertyTypes.includes(option.value)} onClick={() => toggleArrayFilter('propertyTypes', option.value)} />
                                        ))}
                                    </div>
                                </FilterSection>
                                <FilterSection title="BHK" name="bhk" hasActiveFilters={filters.bhkTypes.length > 0}>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_OPTIONS.bhkOptions.map(option => (
                                            <ToggleChip key={option} label={option} selected={filters.bhkTypes.includes(option)} onClick={() => toggleArrayFilter('bhkTypes', option)} />
                                        ))}
                                    </div>
                                </FilterSection>
                                <FilterSection title="Furnishing" name="furnishing" hasActiveFilters={filters.furnishing.length > 0}>
                                    <div className="flex flex-wrap gap-2">
                                        {FILTER_OPTIONS.furnishing.map(option => (
                                            <ToggleChip key={option.value} label={option.label} selected={filters.furnishing.includes(option.value)} onClick={() => toggleArrayFilter('furnishing', option.value)} />
                                        ))}
                                    </div>
                                </FilterSection>
                            </div>
                            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                                <button onClick={handleClearAll} className="flex-1 py-3 text-primary font-medium border border-primary rounded-lg">Clear All</button>
                                <Button onClick={handleSearch} className="flex-1 bg-primary hover:bg-primary/90 py-3">View Properties</Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* More Filters Modal */}
            <AnimatePresence>
                {moreFiltersOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50" onClick={() => setMoreFiltersOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed inset-0 p-3 sm:p-6 z-50">
                            <div className="w-full h-full max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
                                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">More Filters</h2>
                                    <button onClick={() => setMoreFiltersOpen(false)}><X className="h-6 w-6" /></button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Covered Area (sqft)</h3>
                                                <div className="flex items-center gap-2">
                                                    <select value={filters.minArea} onChange={(e) => setFilters(prev => ({ ...prev, minArea: e.target.value }))} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                                        {FILTER_OPTIONS.areaOptions.min.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                    </select>
                                                    <span className="text-gray-400">to</span>
                                                    <select value={filters.maxArea} onChange={(e) => setFilters(prev => ({ ...prev, maxArea: e.target.value }))} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                                                        {FILTER_OPTIONS.areaOptions.max.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Possession Status</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.possessionStatus.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.possessionStatus.includes(option.value)} onClick={() => toggleArrayFilter('possessionStatus', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Ownership</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.ownership.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.ownership.includes(option.value)} onClick={() => toggleArrayFilter('ownership', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Amenities</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.amenities.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.amenities.includes(option.value)} onClick={() => toggleArrayFilter('amenities', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Facing</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.facing.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.facing.includes(option.value)} onClick={() => toggleArrayFilter('facing', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Floor</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.floor.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.floor.includes(option.value)} onClick={() => toggleArrayFilter('floor', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Furnishing</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.furnishing.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.furnishing.includes(option.value)} onClick={() => toggleArrayFilter('furnishing', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3">Posted By</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {FILTER_OPTIONS.postedBy.map(option => (
                                                        <ToggleChip key={option.value} label={option.label} selected={filters.postedBy.includes(option.value)} onClick={() => toggleArrayFilter('postedBy', option.value)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-end gap-3">
                                    <button onClick={handleClearAll} className="px-6 py-2 text-primary font-medium hover:bg-red-50 rounded-lg">Clear All</button>
                                    <Button onClick={handleSearch} className="px-8 bg-primary hover:bg-primary/90">View {properties?.length || 0} Properties</Button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Layout>
    );
}
