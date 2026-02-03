import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Star, Trash2, CheckCircle, XCircle, Loader2, MessageSquare,
    Award, Clock, User, MapPin, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-[99999] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 ${type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}
    >
        {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
        <span className="font-medium">{message}</span>
    </motion.div>
);

export default function AdminTestimonials() {
    const router = useRouter();
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [mounted, setMounted] = useState(false);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({});
    const [toast, setToast] = useState(null);
    const [filter, setFilter] = useState('all'); // all, approved, pending

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role !== 'admin') {
            router.push('/');
        } else {
            fetchTestimonials();
        }
    }, [isAuthenticated, user, router, mounted]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchTestimonials = async () => {
        try {
            const { data } = await axios.get('/api/admin/testimonials');
            if (data.success) {
                setTestimonials(data.testimonials);
            }
        } catch (error) {
            showToast('Failed to fetch testimonials', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id, isApproved) => {
        setActionLoading({ ...actionLoading, [id]: 'approve' });
        try {
            const { data } = await axios.put('/api/admin/testimonials', { id, isApproved });
            if (data.success) {
                setTestimonials(testimonials.map(t => t._id === id ? { ...t, isApproved } : t));
                showToast(isApproved ? 'Testimonial approved' : 'Testimonial unapproved');
            }
        } catch (error) {
            showToast('Failed to update testimonial', 'error');
        } finally {
            setActionLoading({ ...actionLoading, [id]: null });
        }
    };

    const handleFeature = async (id, isFeatured) => {
        setActionLoading({ ...actionLoading, [id]: 'feature' });
        try {
            const { data } = await axios.put('/api/admin/testimonials', { id, isFeatured });
            if (data.success) {
                setTestimonials(testimonials.map(t => t._id === id ? { ...t, isFeatured } : t));
                showToast(isFeatured ? 'Testimonial featured' : 'Testimonial unfeatured');
            }
        } catch (error) {
            showToast('Failed to update testimonial', 'error');
        } finally {
            setActionLoading({ ...actionLoading, [id]: null });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        setActionLoading({ ...actionLoading, [id]: 'delete' });
        try {
            const { data } = await axios.delete(`/api/admin/testimonials?id=${id}`);
            if (data.success) {
                setTestimonials(testimonials.filter(t => t._id !== id));
                showToast('Testimonial deleted');
            }
        } catch (error) {
            showToast('Failed to delete testimonial', 'error');
        } finally {
            setActionLoading({ ...actionLoading, [id]: null });
        }
    };

    const filteredTestimonials = testimonials.filter(t => {
        if (filter === 'approved') return t.isApproved;
        if (filter === 'pending') return !t.isApproved;
        return true;
    });

    const stats = {
        total: testimonials.length,
        approved: testimonials.filter(t => t.isApproved).length,
        pending: testimonials.filter(t => !t.isApproved).length,
        featured: testimonials.filter(t => t.isFeatured).length,
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <Layout>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} />}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                            Manage Testimonials
                        </h1>
                        <p className="text-muted-foreground">Review and manage customer testimonials</p>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {[
                            { label: 'Total', value: stats.total, icon: MessageSquare, gradient: 'from-cyan-500 to-blue-500' },
                            { label: 'Approved', value: stats.approved, icon: CheckCircle, gradient: 'from-emerald-500 to-teal-500' },
                            { label: 'Pending', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
                            { label: 'Featured', value: stats.featured, icon: Award, gradient: 'from-violet-500 to-purple-500' },
                        ].map((stat, index) => {
                            const Icon = stat.icon;
                            return (
                                <motion.div key={index} variants={fadeInUp}>
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                                        <CardContent className="p-5 relative">
                                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                                    <p className="text-3xl font-bold">{stat.value}</p>
                                                </div>
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                                                    <Icon className="h-6 w-6 text-white" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    {/* Filter Tabs */}
                    <motion.div
                        className="flex gap-2 mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {['all', 'approved', 'pending'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                    : 'bg-white text-gray-600 hover:bg-gray-100 border'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </motion.div>

                    {/* Testimonials List */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
                            />
                        </div>
                    ) : filteredTestimonials.length > 0 ? (
                        <motion.div
                            className="space-y-4"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredTestimonials.map((testimonial) => (
                                <motion.div key={testimonial._id} variants={fadeInUp}>
                                    <Card className={`border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden ${!testimonial.isApproved ? 'border-l-4 border-l-amber-500' : ''
                                        } ${testimonial.isFeatured ? 'ring-2 ring-violet-500/30' : ''}`}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                                {/* Avatar */}
                                                <div className="shrink-0">
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                                                        {testimonial.name.charAt(0)}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                                                        {testimonial.isFeatured && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-medium">
                                                                <Sparkles className="h-3 w-3" />
                                                                Featured
                                                            </span>
                                                        )}
                                                        {!testimonial.isApproved && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                                                                <Clock className="h-3 w-3" />
                                                                Pending
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                                                        <span className="flex items-center gap-1">
                                                            <User className="h-4 w-4" />
                                                            {testimonial.role || 'Customer'}
                                                        </span>
                                                        {testimonial.location && (
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {testimonial.location}
                                                            </span>
                                                        )}
                                                        <span className="text-xs">{testimonial.email}</span>
                                                    </div>

                                                    <div className="flex items-center gap-1 mb-3">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-4 w-4 ${i < testimonial.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                                                            />
                                                        ))}
                                                    </div>

                                                    <p className="text-gray-600 leading-relaxed">
                                                        "{testimonial.testimonial}"
                                                    </p>

                                                    <p className="text-xs text-muted-foreground mt-3">
                                                        Submitted: {new Date(testimonial.createdAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric', month: 'long', day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex lg:flex-col gap-2 shrink-0">
                                                    <Button
                                                        size="sm"
                                                        variant={testimonial.isApproved ? "outline" : "default"}
                                                        onClick={() => handleApprove(testimonial._id, !testimonial.isApproved)}
                                                        disabled={actionLoading[testimonial._id] === 'approve'}
                                                        className={testimonial.isApproved ? '' : 'bg-emerald-500 hover:bg-emerald-600'}
                                                    >
                                                        {actionLoading[testimonial._id] === 'approve' ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : testimonial.isApproved ? (
                                                            <>
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                Unapprove
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant={testimonial.isFeatured ? "default" : "outline"}
                                                        onClick={() => handleFeature(testimonial._id, !testimonial.isFeatured)}
                                                        disabled={actionLoading[testimonial._id] === 'feature'}
                                                        className={testimonial.isFeatured ? 'bg-violet-500 hover:bg-violet-600' : ''}
                                                    >
                                                        {actionLoading[testimonial._id] === 'feature' ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Award className="h-4 w-4 mr-1" />
                                                                {testimonial.isFeatured ? 'Unfeature' : 'Feature'}
                                                            </>
                                                        )}
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => handleDelete(testimonial._id)}
                                                        disabled={actionLoading[testimonial._id] === 'delete'}
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        {actionLoading[testimonial._id] === 'delete' ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Trash2 className="h-4 w-4 mr-1" />
                                                                Delete
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-12 text-center">
                                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-bold mb-2">No testimonials found</h3>
                                <p className="text-muted-foreground">
                                    {filter === 'pending'
                                        ? 'No pending testimonials to review'
                                        : filter === 'approved'
                                            ? 'No approved testimonials yet'
                                            : 'No testimonials have been submitted yet'}
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </Layout>
    );
}
