import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    ArrowLeft,
    Search,
    MessageSquare,
    Mail,
    Phone,
    User,
    Trash2,
    AlertCircle,
    Loader2,
    Calendar,
    Check,
    X,
    CheckCircle2,
    Inbox,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm ${type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
            : 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
            }`}
    >
        {type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors">
            <X className="h-4 w-4" />
        </button>
    </motion.div>
);

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 12 }
    }
};

export default function AdminContacts() {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [mounted, setMounted] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all');
    const [toast, setToast] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [unreadCount, setUnreadCount] = useState(0);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user?.role !== 'admin') {
            router.replace('/');
        }
    }, [isAuthenticated, user, router, mounted]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchContacts();
        }
    }, [isAuthenticated, user, page, debouncedSearch, filter]);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/admin/contacts?page=${page}&limit=12&search=${debouncedSearch}&filter=${filter}`, {
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setContacts(data.contacts || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
                setUnreadCount(data.unreadCount || 0);
            } else {
                setError(data.message || 'Failed to fetch contacts');
            }
        } catch (err) {
            setError('Failed to fetch contacts');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        setActionLoading(contactId);
        try {
            const res = await fetch(`/api/admin/contacts?id=${contactId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setContacts(contacts.filter(c => c._id !== contactId));
                showToast('Message deleted successfully', 'success');
            } else {
                showToast(data.message || 'Failed to delete contact', 'error');
            }
        } catch (err) {
            showToast('Failed to delete contact', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleRead = async (contactId, currentStatus) => {
        try {
            const res = await fetch('/api/admin/contacts', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ contactId, isRead: !currentStatus })
            });
            const data = await res.json();
            if (data.success) {
                setContacts(contacts.map(c => c._id === contactId ? { ...c, isRead: !currentStatus } : c));
                setUnreadCount(prev => currentStatus ? prev + 1 : prev - 1);
                showToast(currentStatus ? 'Marked as unread' : 'Marked as read', 'success');
            }
        } catch (err) {
            console.error('Failed to update contact status');
        }
    };

    // Contacts are already filtered server-side
    const filteredContacts = contacts;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <Layout>
            {/* Toast */}
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="absolute top-0 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                className="min-h-screen py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div variants={itemVariants} className="mb-8">
                        <Link href="/admin" className="inline-flex items-center text-primary hover:underline mb-4 group">
                            <motion.div whileHover={{ x: -5 }} className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                Back to Dashboard
                            </motion.div>
                        </Link>
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25"
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Inbox className="h-7 w-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                    Contact Messages
                                </h1>
                                <p className="text-muted-foreground mt-1">
                                    View and manage contact form submissions
                                    {unreadCount > 0 && (
                                        <motion.span
                                            className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-white"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {unreadCount} new
                                        </motion.span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                        <Card className="mb-6 border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Search messages..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 transition-all focus:scale-[1.01]"
                                        />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {['all', 'unread', 'read'].map((f) => (
                                            <motion.div key={f} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                <Button
                                                    variant={filter === f ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setFilter(f)}
                                                    className={filter === f ? 'shadow-lg' : ''}
                                                >
                                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                                    {f === 'unread' && unreadCount > 0 && (
                                                        <span className="ml-1.5 bg-white/20 px-1.5 rounded-full text-xs">
                                                            {unreadCount}
                                                        </span>
                                                    )}
                                                </Button>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <Loader2 className="h-10 w-10 text-primary" />
                            </motion.div>
                        </div>
                    ) : error ? (
                        <motion.div variants={itemVariants}>
                            <Card className="border-red-200 bg-red-50">
                                <CardContent className="p-6 text-center">
                                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-600">{error}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : filteredContacts.length === 0 ? (
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    </motion.div>
                                    <p className="text-gray-500 text-lg">No messages found</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="space-y-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredContacts.map((contact, index) => (
                                <motion.div
                                    key={contact._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.01, y: -2 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Card className={`border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden ${!contact.isRead ? 'ring-2 ring-primary/20' : ''
                                        }`}>
                                        {!contact.isRead && (
                                            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/50" />
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-semibold text-lg">{contact.subject || 'No Subject'}</h3>
                                                        {!contact.isRead && (
                                                            <motion.span
                                                                className="text-xs px-2.5 py-1 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full font-medium"
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ type: "spring", stiffness: 300 }}
                                                            >
                                                                New
                                                            </motion.span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <User className="h-4 w-4 text-primary/50" />
                                                            <span className="font-medium">{contact.name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Mail className="h-4 w-4 text-primary/50" />
                                                            <a href={`mailto:${contact.email}`} className="hover:text-primary transition-colors">{contact.email}</a>
                                                        </div>
                                                        {contact.phone && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Phone className="h-4 w-4 text-primary/50" />
                                                                <a href={`tel:${contact.phone}`} className="hover:text-primary transition-colors">{contact.phone}</a>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-1.5 text-gray-400">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>{formatDate(contact.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 md:ml-2">
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleToggleRead(contact._id, contact.isRead)}
                                                            title={contact.isRead ? 'Mark as unread' : 'Mark as read'}
                                                            className="hover:bg-primary/10"
                                                        >
                                                            {contact.isRead ? <X className="h-4 w-4" /> : <Check className="h-4 w-4 text-green-500" />}
                                                        </Button>
                                                    </motion.div>
                                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteContact(contact._id)}
                                                            disabled={actionLoading === contact._id}
                                                        >
                                                            {actionLoading === contact._id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Trash2 className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </motion.div>
                                                </div>
                                            </div>

                                            <motion.div
                                                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 mt-4"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{contact.message}</p>
                                            </motion.div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <motion.div
                            className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="gap-2 w-full sm:w-auto"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground text-center">
                                Page {page} of {totalPages} ({total} messages)
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="gap-2 w-full sm:w-auto"
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </Layout>
    );
}
