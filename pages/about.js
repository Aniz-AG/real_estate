import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Building2, Users, Award, TrendingUp, Target, Eye, Heart,
    Star, Quote, MapPin, CheckCircle, ArrowRight, Send, Loader2,
    Sparkles, Shield, Clock, Handshake
} from 'lucide-react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import axios from 'axios';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Animated counter hook
const useCounter = (end, duration = 2000) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (!isInView) return;

        let startTime;
        const numericEnd = parseInt(end.replace(/[^0-9]/g, ''));

        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * numericEnd));
            if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }, [isInView, end, duration]);

    return { count, ref };
};

// Stat Card Component - extracted to properly use hooks
const StatCard = ({ stat, index }) => {
    const { count, ref } = useCounter(stat.value);
    const suffix = stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : '';

    return (
        <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden group" ref={ref}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <CardContent className="pt-8 pb-6 relative">
                    <motion.div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                        <Building2 className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                        {count}{suffix}
                    </h3>
                    <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

// Testimonial Card Component
const TestimonialCard = ({ testimonial, index }) => (
    <motion.div
        variants={fadeInUp}
        whileHover={{ y: -5 }}
        className="group"
    >
        <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all bg-white overflow-hidden">
            <CardContent className="p-6 relative">
                <div className="absolute top-4 right-4 text-primary/10">
                    <Quote className="h-12 w-12" />
                </div>

                <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                        />
                    ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed relative z-10">
                    "{testimonial.testimonial}"
                </p>

                <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            {testimonial.role}
                            {testimonial.location && (
                                <>
                                    <span className="mx-1">•</span>
                                    <MapPin className="h-3 w-3" />
                                    {testimonial.location}
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    </motion.div>
);

// Toast notification component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-[99999] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
    >
        <CheckCircle className="h-5 w-5" />
        <span className="font-medium">{message}</span>
    </motion.div>
);

export default function About({ initialTestimonials = [] }) {
    const [testimonials, setTestimonials] = useState(initialTestimonials);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        location: '',
        rating: 5,
        testimonial: '',
    });

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data } = await axios.post('/api/testimonials', formData);
            if (data.success) {
                showToast(data.message);
                setShowForm(false);
                setFormData({ name: '', email: '', role: '', location: '', rating: 5, testimonial: '' });
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit testimonial', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const stats = [
        { value: '10,000+', label: 'Properties Listed', gradient: 'from-cyan-500 to-blue-500' },
        { value: '5,000+', label: 'Happy Clients', gradient: 'from-violet-500 to-purple-500' },
        { value: '500+', label: 'Expert Agents', gradient: 'from-pink-500 to-rose-500' },
        { value: '98%', label: 'Success Rate', gradient: 'from-amber-500 to-orange-500' },
    ];

    const values = [
        {
            icon: Target,
            title: 'Our Mission',
            description: 'To make property buying, selling, and renting accessible and transparent for everyone through technology and exceptional service.',
            gradient: 'from-cyan-500 to-blue-500',
        },
        {
            icon: Eye,
            title: 'Our Vision',
            description: 'To become the most trusted real estate platform, transforming how people find and secure their dream properties.',
            gradient: 'from-violet-500 to-purple-500',
        },
        {
            icon: Heart,
            title: 'Our Values',
            description: 'Integrity, transparency, customer-first approach, and innovation drive everything we do in the real estate market.',
            gradient: 'from-pink-500 to-rose-500',
        },
    ];

    const features = [
        { icon: Shield, title: 'Trusted & Secure', description: 'Verified listings and secure transactions' },
        { icon: Clock, title: 'Quick Process', description: 'Streamlined buying and selling journey' },
        { icon: Handshake, title: 'Expert Support', description: '24/7 dedicated customer assistance' },
        { icon: Sparkles, title: 'Best Deals', description: 'Competitive prices and exclusive offers' },
    ];

    const timeline = [
        { year: '2020', title: 'Founded', description: 'EstateHub was born with a vision to revolutionize real estate' },
        { year: '2021', title: '1000+ Properties', description: 'Reached our first milestone of 1000 listed properties' },
        { year: '2022', title: 'Pan-India Expansion', description: 'Expanded operations to 50+ cities across India' },
        { year: '2023', title: '5000+ Happy Clients', description: 'Helped thousands find their dream homes' },
        { year: '2024', title: 'AI Integration', description: 'Launched AI-powered property recommendations' },
    ];

    return (
        <Layout>
            <SeoHead
                title="About Us - EstateHub"
                description="Learn about EstateHub - your trusted partner in finding the perfect property. Discover our mission, values, and the team behind India's leading real estate platform."
            />

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* Hero Section with Parallax */}
            <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-primary" />
                <motion.div
                    style={{ y: heroY }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />
                </motion.div>

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        className="max-w-4xl mx-auto text-center text-white"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            About EstateHub
                        </motion.span>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Building Dreams,
                            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                                One Home at a Time
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-blue-100/80 max-w-2xl mx-auto mb-10">
                            Your trusted partner in finding the perfect property. We're revolutionizing real estate with innovation and dedication.
                        </p>

                        <motion.div
                            className="flex flex-wrap gap-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Link href="/browse">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="h-14 px-8 bg-white text-primary hover:bg-white/90 shadow-xl rounded-xl">
                                        Browse Properties
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <Link href="/contact">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 rounded-xl">
                                        Get in Touch
                                    </Button>
                                </motion.div>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Scroll indicator */}
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

            {/* Stats Section */}
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
                        {stats.map((stat, index) => (
                            <StatCard key={index} stat={stat} index={index} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission, Vision, Values */}
            <section className="py-20 bg-slate-50 relative">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
                <div className="container mx-auto px-4 relative">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Heart className="h-4 w-4" />
                            What Drives Us
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Our Core Values
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our commitment to excellence and innovation in the real estate industry
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div key={index} variants={fadeInUp} whileHover={{ y: -8 }}>
                                    <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all overflow-hidden group">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                        <CardContent className="p-8 text-center relative">
                                            <motion.div
                                                className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center shadow-xl`}
                                                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                                            >
                                                <Icon className="h-10 w-10 text-white" />
                                            </motion.div>
                                            <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                                            <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-14"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                            whileHover={{ scale: 1.05 }}
                        >
                            <CheckCircle className="h-4 w-4" />
                            Why EstateHub
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Why Choose Us
                        </h2>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            const gradients = ['from-cyan-500 to-blue-500', 'from-violet-500 to-purple-500', 'from-pink-500 to-rose-500', 'from-amber-500 to-orange-500'];
                            return (
                                <motion.div key={index} variants={scaleIn} whileHover={{ y: -5 }}>
                                    <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-all group h-full">
                                        <CardContent className="p-6">
                                            <motion.div
                                                className={`w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br ${gradients[index]} flex items-center justify-center shadow-lg`}
                                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                            >
                                                <Icon className="h-7 w-7 text-white" />
                                            </motion.div>
                                            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>
            </section>

            {/* Timeline / Our Journey */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
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
                            <Clock className="h-4 w-4" />
                            Our Journey
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Our Story
                        </h2>
                    </motion.div>

                    <div className="max-w-4xl mx-auto">
                        <div className="relative">
                            <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-primary via-violet-500 to-pink-500 rounded-full" />

                            {timeline.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className={`relative flex items-center mb-12 last:mb-0 ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                                        <motion.div whileHover={{ scale: 1.02 }}>
                                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                                                <CardContent className="p-6">
                                                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-2">
                                                        {item.year}
                                                    </span>
                                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    </div>

                                    <div className="absolute left-1/2 -translate-x-1/2 w-5 h-5 bg-white border-4 border-primary rounded-full z-10" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
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

                    {testimonials.length > 0 ? (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <TestimonialCard key={testimonial._id || index} testimonial={testimonial} index={index} />
                            ))}
                        </motion.div>
                    ) : (
                        <div className="text-center py-12 mb-8">
                            <p className="text-muted-foreground mb-4">No testimonials yet. Be the first to share your experience!</p>
                        </div>
                    )}

                    {/* Add Testimonial Button / Form */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        {!showForm ? (
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    size="lg"
                                    onClick={() => setShowForm(true)}
                                    className="h-14 px-10 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl rounded-xl"
                                >
                                    <Send className="mr-2 h-5 w-5" />
                                    Share Your Experience
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-2xl mx-auto"
                            >
                                <Card className="border-0 shadow-xl">
                                    <CardContent className="p-8">
                                        <h3 className="text-2xl font-bold mb-6 text-center">Share Your Experience</h3>
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Name *</Label>
                                                    <Input
                                                        id="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                        className="h-12"
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="role">Your Role</Label>
                                                    <Input
                                                        id="role"
                                                        placeholder="e.g., Homeowner, Investor"
                                                        value={formData.role}
                                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                        className="h-12"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="location">Location</Label>
                                                    <Input
                                                        id="location"
                                                        placeholder="e.g., Mumbai"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                        className="h-12"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Rating</Label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, rating: star })}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star
                                                                className={`h-8 w-8 transition-colors ${star <= formData.rating
                                                                    ? 'text-amber-400 fill-amber-400'
                                                                    : 'text-gray-300 hover:text-amber-300'
                                                                    }`}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="testimonial">Your Experience *</Label>
                                                <textarea
                                                    id="testimonial"
                                                    rows={4}
                                                    value={formData.testimonial}
                                                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                                                    required
                                                    maxLength={500}
                                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                                                    placeholder="Share your experience with EstateHub..."
                                                />
                                                <p className="text-xs text-muted-foreground text-right">{formData.testimonial.length}/500</p>
                                            </div>
                                            <div className="flex gap-4 pt-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setShowForm(false)}
                                                    className="flex-1 h-12"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="flex-1 h-12 bg-gradient-to-r from-primary to-blue-600"
                                                >
                                                    {submitting ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                            Submitting...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="h-4 w-4 mr-2" />
                                                            Submit Testimonial
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-primary to-violet-600" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNGMwIDAtMiAyLTIgMnMtMi0yLTItMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />

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
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
                        >
                            <Building2 className="h-10 w-10 text-white" />
                        </motion.div>

                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl md:text-2xl mb-10 text-blue-100/90 max-w-2xl mx-auto">
                            Join thousands of satisfied clients who found their perfect property with EstateHub
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
        const res = await fetch(`${baseUrl}/api/testimonials`);
        const data = res.ok ? await res.json() : {};

        return {
            props: {
                initialTestimonials: data.testimonials || [],
            },
        };
    } catch (error) {
        return {
            props: {
                initialTestimonials: [],
            },
        };
    }
}
