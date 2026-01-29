import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getLatestProperties } from '@/redux/slices/propertySlice';
import axios from 'axios';
import { Building2, MapPin, Bed, Bath, Maximize, Search, TrendingUp, Users, Award, Star, ChevronRight, Home as HomeIcon, ArrowRight, Sparkles, Quote } from 'lucide-react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

// Animation variants for performance - defined outside component
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

// Testimonials data
const testimonials = [
    { name: "Sarah Johnson", role: "Homeowner", image: "https://randomuser.me/api/portraits/women/1.jpg", text: "Found my dream home in just 2 weeks! The team was incredibly helpful throughout the entire process.", rating: 5 },
    { name: "Michael Chen", role: "Property Investor", image: "https://randomuser.me/api/portraits/men/2.jpg", text: "Best real estate platform I've used. The property listings are accurate and the agents are professional.", rating: 5 },
    { name: "Emily Rodriguez", role: "First-time Buyer", image: "https://randomuser.me/api/portraits/women/3.jpg", text: "As a first-time buyer, I was nervous. This team made everything smooth and stress-free!", rating: 5 },
    { name: "David Kim", role: "Homeowner", image: "https://randomuser.me/api/portraits/men/4.jpg", text: "Excellent service and great selection of properties. Highly recommend to everyone!", rating: 5 },
    { name: "Lisa Thompson", role: "Property Seller", image: "https://randomuser.me/api/portraits/women/5.jpg", text: "Sold my property above asking price in record time. Amazing marketing and support!", rating: 5 },
    { name: "James Wilson", role: "Investor", image: "https://randomuser.me/api/portraits/men/6.jpg", text: "The investment insights and market analysis helped me make smart decisions.", rating: 5 },
];

// Infinite Scroll Testimonial Carousel
const TestimonialCarousel = () => {
    return (
        <div className="relative overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10" />
            <motion.div
                className="flex gap-6"
                animate={{ x: [0, -1920] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            >
                {[...testimonials, ...testimonials].map((t, i) => (
                    <motion.div
                        key={i}
                        className="flex-shrink-0 w-[350px]"
                        whileHover={{ scale: 1.02, y: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(t.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <Quote className="h-8 w-8 text-primary/20 mb-2" />
                                <p className="text-gray-600 mb-4 line-clamp-3">{t.text}</p>
                                <div className="flex items-center gap-3 pt-4 border-t">
                                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20" />
                                    <div>
                                        <p className="font-semibold">{t.name}</p>
                                        <p className="text-sm text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default function Home({ latestProperties = [], initialTopCities = [] }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const { properties, loading } = useSelector((state) => state.property);
    const [ssrProperties] = useState(latestProperties);
    const [topCities, setTopCities] = useState(initialTopCities);
    const [searchQuery, setSearchQuery] = useState('');
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Stats with animated counters
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

    const fetchTopCities = async () => {
        try {
            const { data } = await axios.get('/api/property/top-cities');
            setTopCities(data.cities);
        } catch (error) {
            console.error('Failed to fetch cities');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/browse?search=${searchQuery}`);
        }
    };

    const features = [
        { icon: Building2, title: stat1.count.toLocaleString() + '+', description: 'Properties Listed', ref: stat1.ref, gradient: 'from-blue-500 to-cyan-500' },
        { icon: Users, title: stat2.count.toLocaleString() + '+', description: 'Happy Customers', ref: stat2.ref, gradient: 'from-violet-500 to-purple-500' },
        { icon: Award, title: stat3.count.toLocaleString() + '+', description: 'Expert Agents', ref: stat3.ref, gradient: 'from-orange-500 to-amber-500' },
        { icon: TrendingUp, title: stat4.count + '%', description: 'Success Rate', ref: stat4.ref, gradient: 'from-green-500 to-emerald-500' },
    ];

    const displayedProperties = (properties && properties.length ? properties : ssrProperties)?.slice(0, 6) || [];

    return (
        <Layout>
            <SeoHead
                title="Find Your Dream Home"
                description="Browse the latest apartments, villas, and homes across top cities. Find your dream property today."
            />

            {/* Hero Section with Parallax */}
            <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-blue-900">
                {/* Animated Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-violet-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <motion.div
                    className="container relative mx-auto px-4 py-24 md:py-32"
                    style={{ y: heroY, opacity: heroOpacity }}
                >
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
                        >
                            <Sparkles className="h-4 w-4 text-yellow-400" />
                            <span className="text-white/90 text-sm">Trusted by 10,000+ Happy Homeowners</span>
                        </motion.div>

                        <motion.h1
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            Find Your
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                                Dream Home
                            </span>
                        </motion.h1>

                        <motion.p
                            className="text-xl md:text-2xl mb-10 text-blue-100/80 max-w-2xl"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Discover the perfect property from our extensive collection of homes, apartments, and villas across India
                        </motion.p>

                        {/* Animated Search Bar */}
                        <motion.form
                            onSubmit={handleSearch}
                            className="flex flex-col sm:flex-row gap-3 max-w-2xl"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by city, state, or property type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="h-14 pl-12 text-lg bg-white/95 backdrop-blur-sm text-gray-900 border-0 shadow-xl rounded-xl focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="submit" size="lg" className="h-14 px-8 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white shadow-xl shadow-cyan-500/25 rounded-xl">
                                    <Search className="h-5 w-5 mr-2" />
                                    Search
                                </Button>
                            </motion.div>
                        </motion.form>

                        {/* Quick Stats in Hero */}
                        <motion.div
                            className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            {[
                                { value: '10K+', label: 'Properties' },
                                { value: '5K+', label: 'Customers' },
                                { value: '50+', label: 'Cities' },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                                    <p className="text-blue-200/70 text-sm">{stat.label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
                        <div className="w-1 h-2 bg-white/50 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* Features Section with Animated Counters */}
            <section className="py-20 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-500" />
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
                                    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-white to-slate-50 overflow-hidden relative">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                        <CardContent className="pt-8 pb-6 relative">
                                            <motion.div
                                                className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Icon className="h-8 w-8 text-white" />
                                            </motion.div>
                                            <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Latest Properties */}
            <section className="py-20 bg-slate-50 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <HomeIcon className="h-4 w-4" />
                            Featured Listings
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Latest Properties
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Explore our newest listings and find your perfect home
                        </p>
                    </motion.div>

                    {loading && !displayedProperties.length ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                            />
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                        >
                            {displayedProperties.map((property, idx) => (
                                <PropertyCard key={property._id} property={property} index={idx} />
                            ))}
                        </motion.div>
                    )}

                    <motion.div
                        className="text-center mt-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/browse">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button size="lg" className="px-10 h-14 text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/25 rounded-xl">
                                    View All Properties
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </motion.div>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Top Cities */}
            {topCities.length > 0 && (
                <section className="py-20 bg-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(139,92,246,0.05),transparent_50%)]" />
                    <div className="container mx-auto px-4 relative">
                        <motion.div
                            className="text-center mb-14"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <motion.span
                                className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                                whileHover={{ scale: 1.05 }}
                            >
                                <MapPin className="h-4 w-4" />
                                Popular Locations
                            </motion.span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Explore Top Cities
                            </h2>
                            <p className="text-lg text-muted-foreground">
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
                                    'from-cyan-500 to-blue-500',
                                    'from-violet-500 to-purple-500',
                                    'from-pink-500 to-rose-500',
                                    'from-amber-500 to-orange-500',
                                    'from-emerald-500 to-teal-500',
                                ];
                                return (
                                    <motion.div key={index} variants={scaleIn}>
                                        <Link href={`/browse?city=${city.city}`}>
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

            {/* Testimonials Section */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-white overflow-hidden">
                <div className="container mx-auto px-4 mb-12">
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Star className="h-4 w-4 fill-current" />
                            Testimonials
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            What Our Clients Say
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Hear from homeowners who found their perfect property with us
                        </p>
                    </motion.div>
                </div>
                <TestimonialCarousel />
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-primary to-violet-600" />
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

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                            Ready to Find Your
                            <span className="block bg-gradient-to-r from-cyan-300 to-amber-300 bg-clip-text text-transparent">
                                Perfect Property?
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100/90 max-w-2xl mx-auto">
                            Join thousands of happy homeowners who found their dream home with us
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/browse">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="h-14 px-10 text-lg bg-white text-primary hover:bg-white/90 shadow-xl rounded-xl">
                                        Browse Properties
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/contact">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="h-14 px-10 text-lg border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl">
                                        Contact Us
                                    </Button>
                                </motion.div>
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
                className="border-0 shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden bg-white"
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
                            className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg"
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
                                View Details
                                <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
