import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Building2, Plus, Search, Edit, Trash2, Eye, MapPin,
    ArrowLeft, Bed, Bath, Maximize, IndianRupee, X, Check,
    ChevronLeft, ChevronRight, Loader2
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-[99999] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm ${type === 'success'
            ? 'bg-emerald-500/90 text-white'
            : 'bg-red-500/90 text-white'
            }`}
    >
        {type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
            <X className="h-4 w-4" />
        </button>
    </motion.div>
);

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.05 }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100 }
    }
};

export default function ManageProperties() {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [deletingId, setDeletingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [mounted, setMounted] = useState(false);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        if (user?.role !== 'admin') {
            router.push('/');
            return;
        }
    }, [isAuthenticated, user, router, mounted]);

    useEffect(() => {
        if (mounted && isAuthenticated && user?.role === 'admin') {
            fetchProperties();
        }
    }, [page, isAuthenticated, user, mounted]);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/admin/properties?page=${page}&search=${searchQuery}`);
            setProperties(res.data.properties || []);
            setTotalPages(res.data.totalPages || 1);
            setTotal(res.data.total || 0);
        } catch (error) {
            console.error('Error fetching properties:', error);
            showToast('Failed to fetch properties', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProperties();
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        setDeletingId(id);
        try {
            await axios.delete(`/api/admin/properties?id=${id}`);
            showToast('Property deleted successfully');
            fetchProperties();
        } catch (error) {
            console.error('Error deleting property:', error);
            showToast('Failed to delete property', 'error');
        } finally {
            setDeletingId(null);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <Layout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SeoHead title="Manage Properties - Admin" />

            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="outline" size="icon" className="rounded-xl">
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Manage Properties
                                </h1>
                                <p className="text-muted-foreground">
                                    {total} total properties
                                </p>
                            </div>
                        </div>

                        <Link href="/admin/properties/add" className="w-full md:w-auto">
                            <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl shadow-lg shadow-primary/25 w-full md:w-auto">
                                <Plus className="h-5 w-5 mr-2" />
                                Add Property
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Search */}
                    <motion.form
                        onSubmit={handleSearch}
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by address, city, or state..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 h-12 rounded-xl border-gray-200 focus:border-primary"
                                />
                            </div>
                            <Button type="submit" className="h-12 px-6 rounded-xl w-full sm:w-auto">
                                Search
                            </Button>
                        </div>
                    </motion.form>

                    {/* Properties Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                    ) : properties.length === 0 ? (
                        <motion.div
                            className="text-center py-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Building2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Properties Found</h3>
                            <p className="text-gray-500 mb-6">Start by adding your first property</p>
                            <Link href="/admin/properties/add">
                                <Button className="rounded-xl">
                                    <Plus className="h-5 w-5 mr-2" />
                                    Add Property
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <motion.div
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {properties.map((property) => (
                                    <motion.div key={property._id} variants={itemVariants}>
                                        <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all bg-white rounded-2xl">
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img
                                                    src={property.photos?.[0]?.url || '/placeholder-property.jpg'}
                                                    alt={property.address?.property_address}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${property.usage_type === 'Sale'
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                                        }`}>
                                                        For {property.usage_type}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-3 left-3 right-3">
                                                    <p className="text-white font-bold text-lg truncate">
                                                        {formatPrice(property.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <CardContent className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                                                    {property.address?.property_address}
                                                </h3>
                                                <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {property.address?.city}, {property.address?.state}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Bed className="h-4 w-4" />
                                                        {property.nums_bedrooms}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Bath className="h-4 w-4" />
                                                        {property.nums_bathrooms}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Maximize className="h-4 w-4" />
                                                        {property.square_feet} sqft
                                                    </span>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t">
                                                    <Link href={`/property/${property._id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full rounded-lg">
                                                            <Eye className="h-4 w-4 mr-1" />
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/admin/properties/edit/${property._id}`} className="flex-1">
                                                        <Button variant="outline" size="sm" className="w-full rounded-lg">
                                                            <Edit className="h-4 w-4 mr-1" />
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 w-full sm:w-auto"
                                                        onClick={() => handleDelete(property._id)}
                                                        disabled={deletingId === property._id}
                                                    >
                                                        {deletingId === property._id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <motion.div
                                    className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="rounded-xl w-full sm:w-auto"
                                    >
                                        <ChevronLeft className="h-5 w-5 mr-1" />
                                        Previous
                                    </Button>
                                    <span className="text-muted-foreground text-center">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="rounded-xl w-full sm:w-auto"
                                    >
                                        Next
                                        <ChevronRight className="h-5 w-5 ml-1" />
                                    </Button>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </Layout>
    );
}
