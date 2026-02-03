import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Building2, ChevronDown, User, Menu, X, HelpCircle, FileText, Phone, MessageCircle, Shield, BookOpen, MapPin, Search } from 'lucide-react';
import { setSelectedCity, TOP_CITIES, OTHER_CITIES, INDIA_CITIES } from '@/redux/slices/propertySlice';

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { selectedCity } = useSelector((state) => state.property);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [citySearch, setCitySearch] = useState('');
    const [cityResults, setCityResults] = useState(INDIA_CITIES);
    const [cityLoading, setCityLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        const shouldLock = isMobileMenuOpen || !!activeDropdown;
        document.body.style.overflow = shouldLock ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen, activeDropdown]);

    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleCityChange = (cityName) => {
        dispatch(setSelectedCity(cityName));
        if (typeof window !== 'undefined') {
            localStorage.setItem('selectedCity', cityName);
        }
        setActiveDropdown(null);
        setCitySearch('');
    };

    useEffect(() => {
        const query = citySearch.trim();
        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setCityLoading(true);
                const res = await fetch(`/api/cities?query=${encodeURIComponent(query)}&limit=60`, {
                    signal: controller.signal,
                });
                const data = await res.json();
                if (data?.success) {
                    setCityResults(data.cities || []);
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setCityResults(INDIA_CITIES);
                }
            } finally {
                setCityLoading(false);
            }
        }, 300);

        return () => {
            controller.abort();
            clearTimeout(timer);
        };
    }, [citySearch]);

    const normalizedCitySearch = citySearch.trim().toLowerCase();
    const filteredCities = normalizedCitySearch ? cityResults : INDIA_CITIES;

    // Buy Dropdown Menu Data
    const buyMenuData = {
        popularChoices: [
            { label: 'Ready to Move', href: '/browse?status=ready' },
            { label: 'Owner Properties', href: '/browse?owner=true' },
            { label: 'Budget Homes', href: '/browse?budget=budget' },
            { label: 'Premium Homes', href: '/browse?budget=premium' },
            { label: 'New Projects', href: '/new-projects', highlight: true },
        ],
        propertyTypes: [
            { label: 'Flats/Apartments', href: '/browse?type=flat' },
            { label: 'House/Villa', href: '/browse?type=house' },
            { label: 'Plot', href: '/browse?type=plot' },
            { label: 'Office Space', href: '/browse?type=office' },
            { label: 'Commercial Space', href: '/browse?type=commercial' },
        ],
        budget: [
            { label: 'Under ₹50 Lac', href: '/browse?maxPrice=5000000' },
            { label: '₹50 Lac - ₹1 Cr', href: '/browse?minPrice=5000000&maxPrice=10000000' },
            { label: '₹1 Cr - ₹1.5 Cr', href: '/browse?minPrice=10000000&maxPrice=15000000' },
            { label: 'Above ₹1.5 Cr', href: '/browse?minPrice=15000000' },
        ],
        explore: [
            { label: 'Localities', href: '/browse' },
            { label: 'Projects', href: '/new-projects' },
            { label: 'Find an Agent', href: '/agents' },
        ],
    };

    // Help Dropdown Menu Data
    const helpMenuData = [
        { icon: HelpCircle, label: 'FAQs', href: '/help/faq' },
        { icon: FileText, label: 'Buying Guide', href: '/help/buying-guide' },
        { icon: Phone, label: 'Contact Us', href: '/contact' },
        { icon: MessageCircle, label: 'Customer Support', href: '/contact' },
        { icon: Shield, label: 'Safety Tips', href: '/help/safety' },
        { icon: BookOpen, label: 'Terms & Conditions', href: '/terms' },
    ];

    // Login Dropdown Menu Data
    const loginMenuData = isAuthenticated && user ? [
        { label: 'My Profile', href: '/profile' },
        { label: 'My Properties', href: '/profile?tab=properties' },
        { label: 'Saved Searches', href: '/profile?tab=saved' },
        ...(user.role === 'admin' ? [{ label: 'Admin Dashboard', href: '/admin' }] : []),
    ] : [
        { label: 'Login', href: '/login' },
        { label: 'Register', href: '/register' },
    ];

    return (
        <>
            <nav className="sticky top-0 z-[9999] w-full bg-[#C4302B] shadow-lg overflow-visible">
                <div className="container mx-auto px-4 overflow-visible">
                    <div className="flex h-14 items-center justify-between" ref={dropdownRef}>
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <Building2 className="h-7 w-7 text-white" />
                                <span className="text-xl font-bold text-white tracking-wide">
                                    EstateHub
                                </span>
                            </Link>

                            {/* City Dropdown */}
                            <div className="relative hidden md:block">
                                <button
                                    onClick={() => toggleDropdown('city')}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-white hover:bg-white/10 rounded transition-colors text-sm ${activeDropdown === 'city' ? 'bg-white/10' : ''}`}
                                >
                                    <MapPin className="h-4 w-4" />
                                    {selectedCity}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'city' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* City Dropdown Menu */}
                                {activeDropdown === 'city' && (
                                    <div className="absolute top-full left-0 mt-1 w-[90vw] max-w-[520px] bg-white rounded-lg shadow-2xl border border-gray-100 p-4 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                                        {/* Search */}
                                        <div className="mb-4">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={citySearch}
                                                    onChange={(e) => setCitySearch(e.target.value)}
                                                    placeholder="Search city..."
                                                    className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                                />
                                            </div>
                                            {citySearch.trim().length > 0 && (
                                                <button
                                                    onClick={() => handleCityChange(citySearch.trim())}
                                                    className="mt-2 w-full text-left text-sm px-3 py-2 rounded-lg bg-red-50 text-[#C4302B] hover:bg-red-100"
                                                >
                                                    Use "{citySearch.trim()}"
                                                </button>
                                            )}
                                            {cityLoading && (
                                                <div className="mt-2 text-xs text-gray-400">Searching...</div>
                                            )}
                                        </div>
                                        {/* Top Cities */}
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                                <span className="w-1 h-4 bg-[#C4302B] rounded-full"></span>
                                                Top Cities
                                            </h4>
                                            <div className="grid grid-cols-4 gap-2">
                                                {TOP_CITIES.map((city, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleCityChange(city.name)}
                                                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === city.name
                                                            ? 'bg-red-50 text-[#C4302B] font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#C4302B]'
                                                            }`}
                                                    >
                                                        {city.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* All Cities */}
                                        <div className="border-t pt-4">
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                                                <span className="w-1 h-4 bg-gray-400 rounded-full"></span>
                                                All Cities
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                                                {filteredCities.map((city, i) => (
                                                    <button
                                                        key={`${city.name}-${i}`}
                                                        onClick={() => handleCityChange(city.name)}
                                                        className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCity === city.name
                                                            ? 'bg-red-50 text-[#C4302B] font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#C4302B]'
                                                            }`}
                                                    >
                                                        {city.name}
                                                    </button>
                                                ))}
                                                {filteredCities.length === 0 && (
                                                    <div className="col-span-2 md:col-span-3 text-sm text-gray-500 px-2 py-3">
                                                        No cities found.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center space-x-1">
                            {/* Buy Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('buy')}
                                    className={`flex items-center gap-1 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors ${activeDropdown === 'buy' ? 'bg-white/10' : ''}`}
                                >
                                    Buy
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'buy' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Buy Mega Menu */}
                                {activeDropdown === 'buy' && (
                                    <div className="absolute top-full left-0 mt-1 w-[700px] bg-white rounded-lg shadow-2xl border border-gray-100 p-6 grid grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                                        {/* Popular Choices */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Popular Choices</h4>
                                            <ul className="space-y-2">
                                                {buyMenuData.popularChoices.map((item, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setActiveDropdown(null)}
                                                            className={`text-sm hover:text-[#C4302B] transition-colors block ${item.highlight ? 'text-[#C4302B] font-medium' : 'text-gray-600'}`}
                                                        >
                                                            {item.label}
                                                            {item.highlight && (
                                                                <span className="ml-1 text-xs bg-[#FFF3E0] text-[#E65100] px-1.5 py-0.5 rounded">New</span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Property Types */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Property Types</h4>
                                            <ul className="space-y-2">
                                                {buyMenuData.propertyTypes.map((item, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setActiveDropdown(null)}
                                                            className="text-sm text-gray-600 hover:text-[#C4302B] transition-colors block"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Budget */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Budget</h4>
                                            <ul className="space-y-2">
                                                {buyMenuData.budget.map((item, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setActiveDropdown(null)}
                                                            className="text-sm text-gray-600 hover:text-[#C4302B] transition-colors block"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Explore */}
                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Explore</h4>
                                            <ul className="space-y-2">
                                                {buyMenuData.explore.map((item, i) => (
                                                    <li key={i}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setActiveDropdown(null)}
                                                            className="text-sm text-gray-600 hover:text-[#C4302B] transition-colors block"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Help Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('help')}
                                    className={`flex items-center gap-1 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors ${activeDropdown === 'help' ? 'bg-white/10' : ''}`}
                                >
                                    Help
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'help' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Help Menu */}
                                {activeDropdown === 'help' && (
                                    <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                                        {helpMenuData.map((item, i) => {
                                            const Icon = item.icon;
                                            return (
                                                <Link
                                                    key={i}
                                                    href={item.href}
                                                    onClick={() => setActiveDropdown(null)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C4302B] transition-colors"
                                                >
                                                    <Icon className="h-4 w-4" />
                                                    {item.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden lg:flex items-center gap-3">
                            {/* Login Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => toggleDropdown('login')}
                                    className={`flex items-center gap-1 px-4 py-2 text-white hover:bg-white/10 rounded transition-colors ${activeDropdown === 'login' ? 'bg-white/10' : ''}`}
                                >
                                    {isAuthenticated && user ? (
                                        <>
                                            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center mr-1">
                                                {user.photo?.url ? (
                                                    <img src={user.photo.url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <span className="text-sm font-medium">{user.username?.charAt(0).toUpperCase()}</span>
                                                )}
                                            </div>
                                            {user.username}
                                        </>
                                    ) : (
                                        <>
                                            <User className="h-4 w-4 mr-1" />
                                            Login
                                        </>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'login' ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Login Menu */}
                                {activeDropdown === 'login' && (
                                    <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[9999]">
                                        {loginMenuData.map((item, i) => (
                                            <Link
                                                key={i}
                                                href={item.href}
                                                onClick={() => setActiveDropdown(null)}
                                                className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C4302B] transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Post Property Button */}
                            <Link href={isAuthenticated ? "/profile?tab=post" : "/login?redirect=post"}>
                                <button className="px-4 py-2 bg-white text-[#C4302B] font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm flex items-center gap-1.5 border-2 border-white hover:border-gray-100">
                                    Post Property
                                    <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded font-medium">FREE</span>
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 text-white hover:bg-white/10 rounded transition"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Secondary Nav - White bar below header */}
                <div className="hidden lg:block bg-white border-b">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center h-12 gap-8">
                            <Link href="/browse" className="text-sm text-gray-700 hover:text-[#C4302B] transition-colors font-medium">
                                Browse Properties
                            </Link>
                            <Link href="/new-projects" className="text-sm text-gray-700 hover:text-[#C4302B] transition-colors font-medium">
                                New Projects
                            </Link>
                            <Link href="/agents" className="text-sm text-gray-700 hover:text-[#C4302B] transition-colors font-medium">
                                Find Agents
                            </Link>
                            <Link href="/contact" className="text-sm text-gray-700 hover:text-[#C4302B] transition-colors font-medium">
                                Contact
                            </Link>
                            <Link href="/about" className="text-sm text-gray-700 hover:text-[#C4302B] transition-colors font-medium">
                                About Us
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 top-14 z-40 bg-white overflow-y-auto">
                    <div className="p-4 space-y-4">
                        {/* Mobile City Selector */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-[#C4302B]" />
                                Select City
                            </p>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    value={citySearch}
                                    onChange={(e) => setCitySearch(e.target.value)}
                                    placeholder="Search city..."
                                    className="w-full h-10 pl-9 pr-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            {citySearch.trim().length > 0 && (
                                <button
                                    onClick={() => handleCityChange(citySearch.trim())}
                                    className="mb-3 w-full text-left text-sm px-3 py-2 rounded-lg bg-red-50 text-[#C4302B] hover:bg-red-100"
                                >
                                    Use "{citySearch.trim()}"
                                </button>
                            )}
                            {citySearch.trim().length > 0 ? (
                                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                                    {cityResults.map((city, i) => (
                                        <button
                                            key={`${city.name}-${i}`}
                                            onClick={() => handleCityChange(city.name)}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCity === city.name
                                                ? 'bg-[#C4302B] text-white font-medium'
                                                : 'bg-white border border-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                    {cityResults.length === 0 && (
                                        <div className="col-span-2 text-sm text-gray-500">No cities found.</div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {TOP_CITIES.slice(0, 6).map((city, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { handleCityChange(city.name); }}
                                            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${selectedCity === city.name
                                                ? 'bg-[#C4302B] text-white font-medium'
                                                : 'bg-white border border-gray-200 text-gray-600'
                                                }`}
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Nav Links */}
                        <div className="space-y-2">
                            <Link href="/browse" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                Browse Properties
                            </Link>
                            <Link href="/new-projects" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                New Projects
                            </Link>
                            <Link href="/agents" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                Find Agents
                            </Link>
                            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                Contact
                            </Link>
                            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium">
                                About Us
                            </Link>
                        </div>

                        <div className="border-t pt-4">
                            {isAuthenticated && user ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-[#C4302B] flex items-center justify-center text-white font-semibold">
                                            {user.photo?.url ? (
                                                <img src={user.photo.url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                user.username?.charAt(0).toUpperCase()
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{user.username}</p>
                                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                        </div>
                                    </div>
                                    <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                                        My Profile
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
                                            Admin Dashboard
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 border border-[#C4302B] text-[#C4302B] rounded-lg font-medium hover:bg-red-50 transition">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full px-4 py-3 bg-[#C4302B] text-white rounded-lg font-medium hover:bg-[#A52521] transition">
                                            Register
                                        </button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="border-t pt-4">
                            <Link href={isAuthenticated ? "/profile?tab=post" : "/login?redirect=post"} onClick={() => setIsMobileMenuOpen(false)}>
                                <button className="w-full px-4 py-3 bg-[#C4302B] text-white rounded-lg font-semibold hover:bg-[#A52521] transition flex items-center justify-center gap-2">
                                    Post Property
                                    <span className="text-xs bg-green-500 px-1.5 py-0.5 rounded">FREE</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
