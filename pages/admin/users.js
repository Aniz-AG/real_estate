import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    ArrowLeft,
    Search,
    Users,
    Shield,
    ShieldCheck,
    Mail,
    Phone,
    MapPin,
    Trash2,
    AlertCircle,
    Loader2,
    CheckCircle2,
    X,
    Sparkles,
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
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl backdrop-blur-sm ${type === 'success'
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
        transition: { staggerChildren: 0.05, delayChildren: 0.1 }
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

const cardHover = {
    rest: { scale: 1, y: 0 },
    hover: {
        scale: 1.02,
        y: -5,
        transition: { type: "spring", stiffness: 400, damping: 17 }
    }
};

export default function AdminUsers() {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [error, setError] = useState(null);
    const [toast, setToast] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user?.role !== 'admin') {
            router.replace('/');
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'admin') {
            fetchUsers();
        }
    }, [isAuthenticated, user, page, debouncedSearch]);


    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/api/admin/users?page=${page}&limit=12&search=${debouncedSearch}`, {
                credentials: 'include'
            });
            const data = await res.json();
            console.log('Users API response:', data);
            if (data.success) {
                setUsers(data.users || []);
                setTotalPages(data.totalPages || 1);
                setTotal(data.total || 0);
                console.log('Users set:', data.users);
            } else {
                setError(data.message || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Fetch users error:', err);
            setError('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        setActionLoading(userId);
        try {
            const res = await fetch(`/api/admin/users?id=${userId}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) {
                setUsers(users.filter(u => u._id !== userId));
                showToast('User deleted successfully', 'success');
            } else {
                showToast(data.message || 'Failed to delete user', 'error');
            }
        } catch (err) {
            showToast('Failed to delete user', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Are you sure you want to make this user ${newRole === 'admin' ? 'an admin' : 'a regular user'}?`)) return;

        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ userId, role: newRole })
            });
            const data = await res.json();
            console.log(data);
            if (data.success) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
                showToast(`User is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`, 'success');
            } else {
                showToast(data.message || 'Failed to update user role', 'error');
            }
        } catch (err) {
            showToast('Failed to update user role', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    // Users are already filtered server-side, no client-side filter needed
    const filteredUsers = users;

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
                <div className="absolute top-0 -right-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse" />
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
                                className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Users className="h-7 w-7" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                    User Management
                                </h1>
                                <p className="text-muted-foreground mt-1">Manage all registered users</p>
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
                                            placeholder="Search by name, email, or phone..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 transition-all focus:scale-[1.01]"
                                        />
                                    </div>
                                    <motion.div
                                        className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                    >
                                        <Users className="h-4 w-4" />
                                        <span className="font-medium">{filteredUsers.length} users</span>
                                    </motion.div>
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
                    ) : filteredUsers.length === 0 ? (
                        <motion.div variants={itemVariants}>
                            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                                <CardContent className="p-12 text-center">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    </motion.div>
                                    <p className="text-gray-500 text-lg">No users found</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredUsers.map((u, index) => (
                                <motion.div
                                    key={u._id}
                                    variants={itemVariants}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden group">
                                        <div className={`absolute top-0 left-0 w-full h-1 ${u.role === 'admin'
                                            ? 'bg-gradient-to-r from-purple-500 to-violet-500'
                                            : 'bg-gradient-to-r from-gray-400 to-gray-500'
                                            }`} />
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <motion.div whileHover={{ scale: 1.1 }}>
                                                        <Avatar className="h-14 w-14 ring-2 ring-offset-2 ring-primary/20">
                                                            <AvatarImage src={u.photo?.url} alt={u.username} />
                                                            <AvatarFallback className="text-lg bg-gradient-to-br from-primary to-primary/50 text-white">
                                                                {u.username?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </motion.div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{u.username}</h3>
                                                        <motion.span
                                                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${u.role === 'admin'
                                                                ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                                }`}
                                                            whileHover={{ scale: 1.05 }}
                                                        >
                                                            {u.role === 'admin' ? (
                                                                <ShieldCheck className="h-3 w-3" />
                                                            ) : (
                                                                <Shield className="h-3 w-3" />
                                                            )}
                                                            {u.role}
                                                        </motion.span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-4 text-sm">
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Mail className="h-4 w-4 text-primary/50" />
                                                    <span className="truncate">{u.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-muted-foreground">
                                                    <Phone className="h-4 w-4 text-primary/50" />
                                                    <span>{u.phone}</span>
                                                </div>
                                                {u.city && (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <MapPin className="h-4 w-4 text-primary/50" />
                                                        <span>{u.city}{u.state && `, ${u.state}`}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                                                {u._id !== user._id ? (
                                                    <>
                                                        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="w-full"
                                                                onClick={() => handleToggleRole(u._id, u.role)}
                                                                disabled={actionLoading === u._id}
                                                            >
                                                                {actionLoading === u._id ? (
                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    u.role === 'admin' ? 'Make User' : 'Make Admin'
                                                                )}
                                                            </Button>
                                                        </motion.div>
                                                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                disabled={actionLoading === u._id}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </motion.div>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-muted-foreground italic flex items-center gap-2">
                                                        <Sparkles className="h-4 w-4 text-primary" />
                                                        Current user
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Pagination */}
                    {!loading && totalPages > 1 && (
                        <motion.div
                            className="flex justify-center items-center gap-4 mt-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="gap-2"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {page} of {totalPages} ({total} users)
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="gap-2"
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