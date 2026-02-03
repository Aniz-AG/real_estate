import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getLatestProperties, getPropertiesByCity, TOP_CITIES, setSelectedCity, INDIA_CITIES } from '@/redux/slices/propertySlice';
import axios from 'axios';
import { Building2, MapPin, Bed, Bath, Maximize, Search, TrendingUp, Users, Award, Star, ChevronRight, Home as HomeIcon, ArrowRight, ChevronDown, X, Clock, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import Slider from 'react-slick';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } }
};

// Animated Counter Hook
const useCounter = (end, duration = 2000, startOnView = true) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!startOnView || isInView) {
            let startTime;
            const animate = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = Math.min((currentTime - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }
    }, [end, duration, isInView, startOnView]);

    return { count, ref };
};

// Property Types Data
const propertyTypes = [
    { label: 'Flat', value: 'flat', selected: false },
    { label: 'House/Villa', value: 'house', selected: false },
    { label: 'Plot', value: 'plot', selected: false },
    { label: 'Office Space', value: 'office', selected: false },
    { label: 'Shop', value: 'shop', selected: false },
];

const bhkOptions = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5+ BHK'];

// Budget Options
const budgetOptions = {
    min: [
        { label: 'Min', value: '' },
        { label: '₹5 Lac', value: '500000' },
        { label: '₹10 Lac', value: '1000000' },
        { label: '₹20 Lac', value: '2000000' },
        { label: '₹30 Lac', value: '3000000' },
        { label: '₹40 Lac', value: '4000000' },
        { label: '₹50 Lac', value: '5000000' },
        { label: '₹60 Lac', value: '6000000' },
        { label: '₹70 Lac', value: '7000000' },
        { label: '₹80 Lac', value: '8000000' },
        { label: '₹90 Lac', value: '9000000' },
        { label: '₹1 Cr', value: '10000000' },
    ],
    max: [
        { label: 'Max', value: '' },
        { label: '₹10 Lac', value: '1000000' },
        { label: '₹20 Lac', value: '2000000' },
        { label: '₹30 Lac', value: '3000000' },
        { label: '₹50 Lac', value: '5000000' },
        { label: '₹75 Lac', value: '7500000' },
        { label: '₹1 Cr', value: '10000000' },
        { label: '₹1.5 Cr', value: '15000000' },
        { label: '₹2 Cr', value: '20000000' },
        { label: '₹3 Cr', value: '30000000' },
        { label: '₹5 Cr', value: '50000000' },
    ]
};

export default function Home({ latestProperties = [], initialTopCities = [] }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { properties, loading, cityProperties, cityLoading, selectedCity } = useSelector((state) => state.property);
    const [ssrProperties] = useState(latestProperties);
    const [topCities, setTopCities] = useState(initialTopCities);

    // Search State
    const [activeTab, setActiveTab] = useState('buy');
    const [locationInput, setLocationInput] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showPropertyTypeDropdown, setShowPropertyTypeDropdown] = useState(false);
    const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState([]);
    const [selectedBHK, setSelectedBHK] = useState([]);
    const [minBudget, setMinBudget] = useState('');
    const [maxBudget, setMaxBudget] = useState('');
    const [budgetTab, setBudgetTab] = useState('min');
    const [recentSearches] = useState([
        { query: 'Buy in Mumbai', type: 'House/Villa' },
        { query: 'Buy in Bangalore', type: 'Flat' },
    ]);
    const [citySuggestions, setCitySuggestions] = useState(INDIA_CITIES);

    // Refs for click outside
    const locationRef = useRef(null);
    const propertyTypeRef = useRef(null);
    const budgetRef = useRef(null);

    // Stats counters
    const stat1 = useCounter(10000, 2000);
    const stat2 = useCounter(5000, 2000);
    const stat3 = useCounter(500, 2000);
    const stat4 = useCounter(98, 2000);

    useEffect(() => {
        if (!properties?.length) {
            dispatch(getLatestProperties());
        }
        if (!initialTopCities.length) {
            fetchTopCities();
        }
    }, [dispatch, properties?.length, initialTopCities.length]);

    // Fetch properties when city changes
    useEffect(() => {
        if (selectedCity) {
            dispatch(getPropertiesByCity(selectedCity));
        }
    }, [selectedCity, dispatch]);

    useEffect(() => {
        if (!selectedCity) return;
        setSelectedLocations((prev) => (prev.length > 0 ? prev : [selectedCity]));
    }, [selectedCity]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (propertyTypeRef.current && !propertyTypeRef.current.contains(event.target)) {
                setShowPropertyTypeDropdown(false);
            }
            if (budgetRef.current && !budgetRef.current.contains(event.target)) {
                setShowBudgetDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const term = locationInput.trim().toLowerCase();
        if (!term) {
            setCitySuggestions(INDIA_CITIES);
            return;
        }
        setCitySuggestions(
            INDIA_CITIES.filter((city) =>
                `${city.name} ${city.state}`.toLowerCase().includes(term)
            )
        );
    }, [locationInput]);

    const fetchTopCities = async () => {
        try {
            const { data } = await axios.get('/api/property/top-cities');
            setTopCities(data.cities);
        } catch (error) {
            console.error('Failed to fetch cities');
        }
    };

    const handleAddLocation = (location) => {
        if (!selectedLocations.includes(location)) {
            setSelectedLocations([...selectedLocations, location]);
        }
        setLocationInput('');
        setShowLocationDropdown(false);
    };

    const handleRemoveLocation = (location) => {
        setSelectedLocations(selectedLocations.filter(l => l !== location));
    };

    const togglePropertyType = (type) => {
        if (selectedPropertyTypes.includes(type)) {
            setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
        } else {
            setSelectedPropertyTypes([...selectedPropertyTypes, type]);
        }
    };

    const toggleBHK = (bhk) => {
        if (selectedBHK.includes(bhk)) {
            setSelectedBHK(selectedBHK.filter(b => b !== bhk));
        } else {
            setSelectedBHK([...selectedBHK, bhk]);
        }
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedLocations.length > 0) {
            params.set('city', selectedLocations.join(','));
        } else if (selectedCity) {
            params.set('city', selectedCity);
        }
        if (selectedPropertyTypes.length > 0) {
            params.set('type', selectedPropertyTypes.join(','));
        }
        if (minBudget) params.set('minPrice', minBudget);
        if (maxBudget) params.set('maxPrice', maxBudget);
        if (selectedBHK.length > 0) {
            params.set('bhk', selectedBHK.join(','));
        }

        const destination = activeTab === 'buy' ? '/browse' : '/new-projects';
        router.push(`${destination}?${params.toString()}`);
    };

    const getPropertyTypeLabel = () => {
        if (selectedPropertyTypes.length === 0) return 'Property Type';
        if (selectedPropertyTypes.length === 1) {
            const type = propertyTypes.find(t => t.value === selectedPropertyTypes[0]);
            return type?.label || 'Property Type';
        }
        return `${propertyTypes.find(t => t.value === selectedPropertyTypes[0])?.label} +${selectedPropertyTypes.length - 1}`;
    };

    const getBudgetLabel = () => {
        if (!minBudget && !maxBudget) return 'Budget';
        if (minBudget && maxBudget) {
            const minLabel = budgetOptions.min.find(b => b.value === minBudget)?.label || '';
            const maxLabel = budgetOptions.max.find(b => b.value === maxBudget)?.label || '';
            return `${minLabel} - ${maxLabel}`;
        }
        if (minBudget) {
            const minLabel = budgetOptions.min.find(b => b.value === minBudget)?.label || '';
            return `${minLabel}+`;
        }
        if (maxBudget) {
            const maxLabel = budgetOptions.max.find(b => b.value === maxBudget)?.label || '';
            return `Upto ${maxLabel}`;
        }
        return 'Budget';
    };

    const features = [
        { icon: Building2, title: stat1.count.toLocaleString() + '+', description: 'Properties Listed', ref: stat1.ref, gradient: 'from-red-500 to-rose-500' },
        { icon: Users, title: stat2.count.toLocaleString() + '+', description: 'Happy Customers', ref: stat2.ref, gradient: 'from-red-600 to-red-500' },
        { icon: Award, title: stat3.count.toLocaleString() + '+', description: 'Expert Agents', ref: stat3.ref, gradient: 'from-orange-500 to-amber-500' },
        { icon: TrendingUp, title: stat4.count + '%', description: 'Success Rate', ref: stat4.ref, gradient: 'from-green-500 to-emerald-500' },
    ];

    // Carousel slider settings
    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        responsive: [
            {
                breakpoint: 1280,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    // Slider refs for custom arrows
    const featuredSliderRef = useRef(null);
    const latestSliderRef = useRef(null);
    const topProjectsSliderRef = useRef(null);

    // Filter properties for different sections (you can update this logic later based on your categories)
    const cityFilteredProperties = cityProperties || [];
    const featuredProperties = cityFilteredProperties.filter(p => p.featured || p.price > 10000000).slice(0, 10);
    const latestCityProperties = cityFilteredProperties.slice(0, 10);
    const topProjects = cityFilteredProperties.filter(p => p.property_type === 'apartment' || p.property_type === 'flat').slice(0, 10);

    const displayedProperties = (properties && properties.length ? properties : ssrProperties)?.slice(0, 6) || [];

    return (
        <Layout>
            <SeoHead
                title="Find Your Dream Home | EstateHub"
                description="Browse the latest apartments, villas, and homes across top cities. Find your dream property today."
            />

            {/* Hero Search Section - Magic Bricks Style */}
            <section className="bg-white py-12 md:py-16 overflow-visible">
                <div className="container mx-auto px-4 overflow-visible">
                    <div className="max-w-5xl mx-auto overflow-visible">
                        {/* Tagline */}
                        <motion.div
                            className="text-center mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-2">
                                Start your <span className="font-bold">#PropertySearch</span> Journey
                            </h1>
                        </motion.div>

                        {/* Tabs */}
                        <div className="flex justify-center gap-8 mb-6">
                            <button
                                onClick={() => setActiveTab('buy')}
                                className={`relative pb-2 text-lg font-medium transition-colors ${activeTab === 'buy' ? 'text-[#C4302B]' : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                Buy
                                {activeTab === 'buy' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4302B]"
                                    />
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('new-projects')}
                                className={`relative pb-2 text-lg font-medium transition-colors ${activeTab === 'new-projects' ? 'text-[#C4302B]' : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                New Projects
                                {activeTab === 'new-projects' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C4302B]"
                                    />
                                )}
                            </button>
                        </div>

                        {/* Search Bar Container */}
                        <motion.div
                            className="bg-white rounded-2xl md:rounded-full shadow-lg border border-gray-200 p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 overflow-visible"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            {/* Location Input */}
                            <div className="relative flex-1 w-full" ref={locationRef}>
                                <div
                                    className="flex items-center gap-2 px-4 py-3 cursor-text rounded-xl md:rounded-full"
                                    onClick={() => setShowLocationDropdown(true)}
                                >
                                    <MapPin className="h-5 w-5 text-[#C4302B] flex-shrink-0" />
                                    <div className="flex items-center gap-2 flex-wrap flex-1">
                                        {selectedLocations.map((loc, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 bg-red-50 text-gray-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {loc}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveLocation(loc); }}
                                                    className="hover:text-[#C4302B]"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                        <input
                                            type="text"
                                            value={locationInput}
                                            onChange={(e) => setLocationInput(e.target.value)}
                                            onFocus={() => setShowLocationDropdown(true)}
                                            placeholder={selectedLocations.length === 0 ? "Add more..." : "Add more..."}
                                            className="flex-1 min-w-[100px] outline-none text-gray-700 placeholder-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* Location Dropdown */}
                                {showLocationDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 py-3 z-[9999]">
                                        {recentSearches.length > 0 && (
                                            <div className="px-4 pb-3 border-b">
                                                <p className="text-sm font-semibold text-gray-800 mb-2">Recent Searches</p>
                                                {recentSearches.map((search, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleAddLocation(search.query.split(' in ')[1])}
                                                        className="flex items-center gap-3 w-full text-left py-2 hover:bg-gray-50 rounded"
                                                    >
                                                        <Clock className="h-4 w-4 text-gray-400" />
                                                        <div>
                                                            <p className="text-sm text-gray-700">{search.query}</p>
                                                            <p className="text-xs text-gray-500">{search.type}</p>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        <div className="px-4 pt-3">
                                            <p className="text-sm font-semibold text-gray-800 mb-2">Popular Cities</p>
                                            <div className="flex flex-wrap gap-2">
                                                {TOP_CITIES.map((city, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleAddLocation(city.name)}
                                                        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedLocations.includes(city.name)
                                                            ? 'bg-red-50 border-[#C4302B] text-[#C4302B]'
                                                            : 'border-gray-200 text-gray-600 hover:border-[#C4302B] hover:text-[#C4302B]'
                                                            }`}
                                                    >
                                                        {city.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="px-4 pt-4 border-t">
                                            <p className="text-sm font-semibold text-gray-800 mb-2">All Cities</p>
                                            <div className="max-h-56 overflow-y-auto">
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                    {citySuggestions.map((city) => (
                                                        <button
                                                            key={`${city.name}-${city.state}`}
                                                            onClick={() => handleAddLocation(city.name)}
                                                            className={`px-3 py-2 rounded-lg text-sm border transition-colors text-left ${selectedLocations.includes(city.name)
                                                                ? 'bg-red-50 border-[#C4302B] text-[#C4302B]'
                                                                : 'border-gray-200 text-gray-600 hover:border-[#C4302B] hover:text-[#C4302B]'
                                                                }`}
                                                        >
                                                            {city.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-200" />

                            {/* Property Type Dropdown */}
                            <div className="relative" ref={propertyTypeRef}>
                                <button
                                    onClick={() => setShowPropertyTypeDropdown(!showPropertyTypeDropdown)}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-xl md:rounded-full transition-colors w-full md:w-auto md:min-w-[160px] justify-between"
                                >
                                    <HomeIcon className="h-5 w-5 text-gray-500" />
                                    <span className="text-gray-700">{getPropertyTypeLabel()}</span>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 ml-auto transition-transform ${showPropertyTypeDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showPropertyTypeDropdown && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 py-4 px-4 z-[9999] w-full md:min-w-[280px] md:w-auto">
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-800 mb-3">Residential</p>
                                            <div className="flex flex-wrap gap-2">
                                                {propertyTypes.slice(0, 3).map((type, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => togglePropertyType(type.value)}
                                                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedPropertyTypes.includes(type.value)
                                                            ? 'bg-red-50 border-[#C4302B] text-[#C4302B]'
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-800 mb-3">BHK Type</p>
                                            <div className="flex flex-wrap gap-2">
                                                {bhkOptions.map((bhk, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => toggleBHK(bhk)}
                                                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedBHK.includes(bhk)
                                                            ? 'bg-red-50 border-[#C4302B] text-[#C4302B] font-medium'
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {bhk}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800 mb-3">Commercial</p>
                                            <div className="flex flex-wrap gap-2">
                                                {propertyTypes.slice(3).map((type, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => togglePropertyType(type.value)}
                                                        className={`px-4 py-2 rounded-full text-sm border transition-colors ${selectedPropertyTypes.includes(type.value)
                                                            ? 'bg-red-50 border-[#C4302B] text-[#C4302B]'
                                                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="hidden md:block w-px h-10 bg-gray-200" />

                            {/* Budget Dropdown */}
                            <div className="relative" ref={budgetRef}>
                                <button
                                    onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}
                                    className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 rounded-xl md:rounded-full transition-colors w-full md:w-auto md:min-w-[140px] justify-between"
                                >
                                    <span className="text-[#C4302B] font-bold">₹</span>
                                    <span className="text-gray-700">{getBudgetLabel()}</span>
                                    <ChevronDown className={`h-4 w-4 text-gray-400 ml-auto transition-transform ${showBudgetDropdown ? 'rotate-180' : ''}`} />
                                </button>

                                {showBudgetDropdown && (
                                    <div className="absolute top-full left-0 right-0 md:right-0 md:left-auto mt-2 bg-white rounded-lg shadow-2xl border border-gray-100 py-4 z-[9999] w-full md:min-w-[280px] md:w-auto">
                                        <div className="flex border-b mb-3">
                                            <button
                                                onClick={() => setBudgetTab('min')}
                                                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${budgetTab === 'min'
                                                    ? 'border-[#C4302B] text-[#C4302B]'
                                                    : 'border-transparent text-gray-500'
                                                    }`}
                                            >
                                                Min Price
                                            </button>
                                            <button
                                                onClick={() => setBudgetTab('max')}
                                                className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${budgetTab === 'max'
                                                    ? 'border-[#C4302B] text-[#C4302B]'
                                                    : 'border-transparent text-gray-500'
                                                    }`}
                                            >
                                                Max Price
                                            </button>
                                        </div>
                                        <div className="max-h-60 overflow-y-auto px-2">
                                            {(budgetTab === 'min' ? budgetOptions.min : budgetOptions.max).map((option, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        if (budgetTab === 'min') {
                                                            setMinBudget(option.value);
                                                        } else {
                                                            setMaxBudget(option.value);
                                                        }
                                                    }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm rounded hover:bg-gray-50 transition-colors ${(budgetTab === 'min' ? minBudget : maxBudget) === option.value
                                                        ? 'bg-red-50 text-[#C4302B] font-medium'
                                                        : 'text-gray-700'
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-[#C4302B] hover:bg-[#A52521] text-white px-8 py-3 rounded-full font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-red-500/20"
                            >
                                <Search className="h-5 w-5" />
                                Search
                            </button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* City Header */}
            <section className="py-6 bg-gradient-to-r from-gray-50 to-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Properties in <span className="text-[#C4302B]">{selectedCity}</span>
                            </h2>
                            <p className="text-gray-500 mt-1">Explore the best properties in your selected city</p>
                        </div>
                        <Link href={`/browse?city=${selectedCity}`}>
                            <Button variant="outline" className="border-[#C4302B] text-[#C4302B] hover:bg-red-50">
                                View All in {selectedCity}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Properties Carousel */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                                <Star className="h-3 w-3 fill-current" />
                                Premium
                            </span>
                            <h3 className="text-2xl font-bold text-gray-800">Featured Properties</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => featuredSliderRef.current?.slickPrev()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => featuredSliderRef.current?.slickNext()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {cityLoading ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-4 border-[#C4302B] border-t-transparent rounded-full"
                            />
                        </div>
                    ) : featuredProperties.length > 0 ? (
                        <Slider ref={featuredSliderRef} {...sliderSettings}>
                            {featuredProperties.map((property, idx) => (
                                <div key={property._id} className="px-2">
                                    <PropertyCard property={property} index={idx} />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No featured properties found in {selectedCity}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Latest Properties in City Carousel */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                                <Clock className="h-3 w-3" />
                                Just Listed
                            </span>
                            <h3 className="text-2xl font-bold text-gray-800">Latest Properties</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => latestSliderRef.current?.slickPrev()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors bg-white"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => latestSliderRef.current?.slickNext()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors bg-white"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {cityLoading ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-4 border-[#C4302B] border-t-transparent rounded-full"
                            />
                        </div>
                    ) : latestCityProperties.length > 0 ? (
                        <Slider ref={latestSliderRef} {...sliderSettings}>
                            {latestCityProperties.map((property, idx) => (
                                <div key={property._id} className="px-2">
                                    <PropertyCard property={property} index={idx} />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No properties found in {selectedCity}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Top Projects Carousel */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-2">
                                <TrendingUp className="h-3 w-3" />
                                Trending
                            </span>
                            <h3 className="text-2xl font-bold text-gray-800">Top Projects</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => topProjectsSliderRef.current?.slickPrev()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => topProjectsSliderRef.current?.slickNext()}
                                className="p-2 rounded-full border border-gray-200 hover:border-[#C4302B] hover:text-[#C4302B] transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {cityLoading ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-10 h-10 border-4 border-[#C4302B] border-t-transparent rounded-full"
                            />
                        </div>
                    ) : topProjects.length > 0 ? (
                        <Slider ref={topProjectsSliderRef} {...sliderSettings}>
                            {topProjects.map((property, idx) => (
                                <div key={property._id} className="px-2">
                                    <PropertyCard property={property} index={idx} />
                                </div>
                            ))}
                        </Slider>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No projects found in {selectedCity}</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    ref={feature.ref}
                                    variants={scaleIn}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="group"
                                >
                                    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all bg-white overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                        <CardContent className="pt-8 pb-6 relative">
                                            <motion.div
                                                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Icon className="h-8 w-8 text-white" />
                                            </motion.div>
                                            <h3 className="text-3xl font-bold mb-2 text-gray-800">
                                                {feature.title}
                                            </h3>
                                            <p className="text-gray-500">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Top Cities */}
            {topCities.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                                <MapPin className="h-4 w-4" />
                                Popular Locations
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
                                Explore Top Cities
                            </h2>
                            <p className="text-lg text-gray-500">
                                Find properties in the most popular locations
                            </p>
                        </motion.div>

                        <motion.div
                            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {topCities.map((city, index) => {
                                const gradients = [
                                    'from-red-500 to-rose-500',
                                    'from-orange-500 to-amber-500',
                                    'from-pink-500 to-rose-500',
                                    'from-amber-500 to-orange-500',
                                    'from-emerald-500 to-teal-500',
                                ];
                                return (
                                    <motion.div key={index} variants={scaleIn}>
                                        <Link
                                            href={`/browse?city=${city.city}`}
                                            onClick={() => {
                                                dispatch(setSelectedCity(city.city));
                                                if (typeof window !== 'undefined') {
                                                    localStorage.setItem('selectedCity', city.city);
                                                }
                                            }}
                                        >
                                            <motion.div
                                                whileHover={{ y: -8, scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                className="group"
                                            >
                                                <Card className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden bg-gradient-to-br from-white to-slate-50">
                                                    <CardContent className="p-6 text-center relative">
                                                        <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index % 5]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                                        <motion.div
                                                            className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradients[index % 5]} flex items-center justify-center shadow-lg`}
                                                            whileHover={{ rotate: [0, -10, 10, 0] }}
                                                        >
                                                            <MapPin className="h-7 w-7 text-white" />
                                                        </motion.div>
                                                        <h3 className="font-bold text-lg mb-1">{city.city}</h3>
                                                        <p className="text-sm text-muted-foreground mb-2">{city.state}</p>
                                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${gradients[index % 5]} text-white`}>
                                                            {city.count} Properties
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#C4302B] via-[#A52521] to-[#8B1E1A]" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNGMwIDAtMiAyLTIgMnMtMi0yLTItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

                {/* Floating Elements */}
                <motion.div
                    className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
                    animate={{ y: [0, 20, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
                    animate={{ y: [0, -20, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 5, repeat: Infinity }}
                />

                <div className="container mx-auto px-4 text-center relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <HomeIcon className="h-10 w-10 text-white" />
                        </motion.div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
                            Ready to Find Your Perfect Property?
                        </h2>
                        <p className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto">
                            Join thousands of happy homeowners who found their dream home with us
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/browse">
                                <Button size="lg" className="h-12 px-8 text-base bg-white text-[#C4302B] hover:bg-gray-100 shadow-xl rounded-lg font-semibold">
                                    Browse Properties
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 rounded-lg font-semibold">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `http://${req.headers.host}`;

    try {
        const [latestRes, topCitiesRes] = await Promise.all([
            fetch(`${baseUrl}/api/property/latest`),
            fetch(`${baseUrl}/api/property/top-cities`),
        ]);

        const latestJson = latestRes.ok ? await latestRes.json() : {};
        const topCitiesJson = topCitiesRes.ok ? await topCitiesRes.json() : {};

        return {
            props: {
                latestProperties: latestJson.properties || [],
                initialTopCities: topCitiesJson.cities || [],
            },
        };
    } catch (error) {
        return {
            props: {
                latestProperties: [],
                initialTopCities: [],
            },
        };
    }
}

function PropertyCard({ property, index = 0 }) {
    const router = useRouter();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <motion.div
            variants={fadeInUp}
            whileHover={{ y: -8 }}
            className="group"
        >
            <Card
                className="border border-gray-100 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden bg-white"
                onClick={() => router.push(`/property/${property._id}`)}
            >
                <div className="relative h-52 overflow-hidden">
                    <img
                        src={property.photos[0]?.url || '/placeholder-property.jpg'}
                        alt={property.address.property_address}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 right-3">
                        <span className="bg-[#C4302B] text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                            For {property.usage_type}
                        </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Bed className="h-3 w-3" /> {property.nums_bedrooms}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Bath className="h-3 w-3" /> {property.nums_bathrooms}
                        </span>
                        <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                            <Maximize className="h-3 w-3" /> {property.square_feet}
                        </span>
                    </div>
                </div>
                <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-[#C4302B] transition-colors">
                        {property.address.property_address}
                    </h3>
                    <p className="text-gray-500 mb-4 flex items-center gap-1.5 text-sm">
                        <MapPin className="h-4 w-4 text-[#C4302B]" />
                        {property.address.city}, {property.address.state}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-xl font-bold text-[#C4302B]">
                            {formatPrice(property.price)}
                        </span>
                        <Button size="sm" className="rounded-lg bg-[#C4302B] hover:bg-[#A52521] text-white">
                            View Details
                            <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
