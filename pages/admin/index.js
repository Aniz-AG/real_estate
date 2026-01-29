import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Users, Mail, Plus, TrendingUp, ArrowRight, Sparkles, LayoutDashboard } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    }, [value, duration]);

    return <span>{count}</span>;
};

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};

const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 17 }
    }
};

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [stats, setStats] = useState({ properties: 0, users: 0, contacts: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (user?.role !== 'admin') {
            router.replace('/');
            return;
        }

        const fetchStats = async () => {
            try {
                const [propertiesRes, usersRes, contactsRes] = await Promise.allSettled([
                    axios.get('/api/admin/properties?page=1&search='),
                    axios.get('/api/admin/users'),
                    axios.get('/api/admin/contacts')
                ]);

                setStats({
                    properties: propertiesRes.status === 'fulfilled' ? propertiesRes.value.data.total || propertiesRes.value.data.properties?.length || 0 : 0,
                    users: usersRes.status === 'fulfilled' ? usersRes.value.data.users?.length || 0 : 0,
                    contacts: contactsRes.status === 'fulfilled' ? contactsRes.value.data.contacts?.length || 0 : 0
                });
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [isAuthenticated, user, router]);

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                    />
                </div>
            </Layout>
        );
    }

    const statCards = [
        {
            title: 'Total Properties',
            value: stats.properties,
            icon: Building2,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-500/10 to-cyan-500/10'
        },
        {
            title: 'Total Users',
            value: stats.users,
            icon: Users,
            gradient: 'from-violet-500 to-purple-500',
            bgGradient: 'from-violet-500/10 to-purple-500/10'
        },
        {
            title: 'Contact Messages',
            value: stats.contacts,
            icon: Mail,
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-500/10 to-red-500/10'
        }
    ];

    const quickActions = [
        { title: 'Properties', description: 'Manage all property listings', icon: Building2, href: '/admin/properties', color: 'blue' },
        { title: 'Users', description: 'Manage user accounts', icon: Users, href: '/admin/users', color: 'violet' },
        { title: 'Contacts', description: 'View contact messages', icon: Mail, href: '/admin/contacts', color: 'orange' }
    ];

    return (
        <Layout>
            <SeoHead title="Admin Dashboard" description="Admin dashboard for managing properties" />

            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <motion.div
                className="container mx-auto px-4 py-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Header Section */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-white shadow-lg shadow-primary/25"
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <LayoutDashboard className="h-8 w-8" />
                        </motion.div>
                        <div>
                            <motion.h1
                                className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent"
                            >
                                Admin Dashboard
                            </motion.h1>
                            <p className="text-muted-foreground mt-1">Welcome back, {user?.username || 'Admin'}</p>
                        </div>
                    </div>
                    <Link href="/admin/properties/add">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25">
                                <Plus className="h-4 w-4" />
                                Add Property
                                <Sparkles className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            variants={cardHover}
                            initial="rest"
                            whileHover="hover"
                            className="relative overflow-hidden"
                        >
                            <Card className={`border-0 shadow-xl bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm`}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground font-medium mb-2">{stat.title}</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                                                    {loading ? (
                                                        <motion.div
                                                            className="w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                                        />
                                                    ) : (
                                                        <AnimatedCounter value={stat.value} />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <motion.div
                                            className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}
                                            whileHover={{ rotate: 360 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <stat.icon className="h-6 w-6" />
                                        </motion.div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                        <span className="text-green-500 font-medium">Active</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-2 mb-6">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-semibold">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <Link key={action.title} href={action.href}>
                                <motion.div
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                    className="h-full"
                                >
                                    <Card className="h-full cursor-pointer border border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors group overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <CardTitle className="text-lg font-medium group-hover:text-primary transition-colors">
                                                {action.title}
                                            </CardTitle>
                                            <motion.div
                                                className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 group-hover:bg-primary group-hover:text-white transition-all"
                                                whileHover={{ rotate: 12 }}
                                            >
                                                <action.icon className="h-5 w-5" />
                                            </motion.div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                                            <div className="flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span>Go to {action.title}</span>
                                                <motion.div
                                                    animate={{ x: [0, 5, 0] }}
                                                    transition={{ duration: 1, repeat: Infinity }}
                                                >
                                                    <ArrowRight className="h-4 w-4 ml-2" />
                                                </motion.div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.div>

                {/* Footer Note */}
                <motion.div
                    variants={itemVariants}
                    className="mt-12 text-center"
                >
                    <p className="text-sm text-muted-foreground">
                        Last updated: {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </motion.div>
            </motion.div>
        </Layout>
    );
}
