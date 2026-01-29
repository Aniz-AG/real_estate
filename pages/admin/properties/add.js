import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft,
    Upload,
    X,
    Loader2,
    Building,
    MapPin,
    DollarSign,
    Bed,
    Bath,
    Square,
    Image as ImageIcon,
    CheckCircle2,
    AlertCircle,
    Sparkles
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
        {type === 'success' ? (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <CheckCircle2 className="h-6 w-6" />
            </motion.div>
        ) : (
            <AlertCircle className="h-6 w-6" />
        )}
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
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    }
};

export default function AddProperty() {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [toast, setToast] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        propertyType: 'house',
        status: 'sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        amenities: ''
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user?.role !== 'admin') {
            router.replace('/');
        }
    }, [isAuthenticated, user, router]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 10) {
            showToast('Maximum 10 images allowed', 'error');
            return;
        }

        setImages(prev => [...prev, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length === 0) {
            showToast('Please upload at least one image', 'error');
            return;
        }

        setLoading(true);
        setUploadProgress(10);

        try {
            const form = new FormData();

            // Append all form fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            });

            setUploadProgress(30);

            // Append images
            images.forEach(image => {
                form.append('images', image);
            });

            setUploadProgress(50);

            const res = await fetch('/api/property/create', {
                method: 'POST',
                body: form
            });

            setUploadProgress(80);

            const data = await res.json();

            if (data.success) {
                setUploadProgress(100);
                showToast('Property created successfully! 🎉', 'success');
                setTimeout(() => {
                    router.push('/admin/properties');
                }, 1500);
            } else {
                showToast(data.message || 'Failed to create property', 'error');
                setUploadProgress(0);
            }
        } catch (error) {
            console.error('Error creating property:', error);
            showToast('Failed to create property', 'error');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated || user?.role !== 'admin') {
        return null;
    }

    return (
        <Layout>
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <Toast
                        message={toast.message}
                        type={toast.type}
                        onClose={() => setToast(null)}
                    />
                )}
            </AnimatePresence>

            {/* Animated Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="absolute top-0 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 -left-40 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                className="min-h-screen py-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div variants={cardVariants} className="mb-8">
                        <Link href="/admin/properties" className="inline-flex items-center text-primary hover:underline mb-4 group">
                            <motion.div whileHover={{ x: -5 }} className="flex items-center">
                                <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                                Back to Properties
                            </motion.div>
                        </Link>
                        <div className="flex items-center gap-4 mb-2">
                            <motion.div
                                className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/50 text-white shadow-lg shadow-primary/25"
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <Sparkles className="h-6 w-6" />
                            </motion.div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                                    Add New Property
                                </h1>
                                <p className="text-muted-foreground mt-1">Fill in the details to list a new property</p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-4"
                            >
                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                                    <span>Uploading property...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    <form onSubmit={handleSubmit}>
                        <motion.div className="space-y-6" variants={containerVariants}>
                            {/* Basic Info */}
                            <motion.div variants={cardVariants}>
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <Building className="h-5 w-5" />
                                            </div>
                                            Basic Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Property Title *</Label>
                                            <Input
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Beautiful 3BR House with Garden"
                                                required
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Description *</Label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                placeholder="Describe the property..."
                                                className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all focus:scale-[1.01]"
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="propertyType">Property Type *</Label>
                                                <select
                                                    id="propertyType"
                                                    name="propertyType"
                                                    value={formData.propertyType}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                >
                                                    <option value="house">House</option>
                                                    <option value="apartment">Apartment</option>
                                                    <option value="villa">Villa</option>
                                                    <option value="land">Land</option>
                                                    <option value="commercial">Commercial</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label htmlFor="status">Listing Type *</Label>
                                                <select
                                                    id="status"
                                                    name="status"
                                                    value={formData.status}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                                    required
                                                >
                                                    <option value="sale">For Sale</option>
                                                    <option value="rent">For Rent</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Pricing & Details */}
                            <motion.div variants={cardVariants}>
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                                                <DollarSign className="h-5 w-5" />
                                            </div>
                                            Pricing & Details
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <div>
                                                <Label htmlFor="price">Price ($) *</Label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="price"
                                                        name="price"
                                                        type="number"
                                                        value={formData.price}
                                                        onChange={handleInputChange}
                                                        placeholder="0"
                                                        className="pl-10"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="bedrooms">Bedrooms</Label>
                                                <div className="relative">
                                                    <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="bedrooms"
                                                        name="bedrooms"
                                                        type="number"
                                                        value={formData.bedrooms}
                                                        onChange={handleInputChange}
                                                        placeholder="0"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="bathrooms">Bathrooms</Label>
                                                <div className="relative">
                                                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="bathrooms"
                                                        name="bathrooms"
                                                        type="number"
                                                        value={formData.bathrooms}
                                                        onChange={handleInputChange}
                                                        placeholder="0"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <Label htmlFor="area">Area (sqft)</Label>
                                                <div className="relative">
                                                    <Square className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                    <Input
                                                        id="area"
                                                        name="area"
                                                        type="number"
                                                        value={formData.area}
                                                        onChange={handleInputChange}
                                                        placeholder="0"
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Location */}
                            <motion.div variants={cardVariants}>
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-purple-500" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-600">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            Location
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label htmlFor="address">Address *</Label>
                                            <Input
                                                id="address"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="Street address"
                                                required
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor="city">City *</Label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleInputChange}
                                                    placeholder="City"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="state">State *</Label>
                                                <Input
                                                    id="state"
                                                    name="state"
                                                    value={formData.state}
                                                    onChange={handleInputChange}
                                                    placeholder="State"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="pincode">ZIP Code</Label>
                                                <Input
                                                    id="pincode"
                                                    name="pincode"
                                                    value={formData.pincode}
                                                    onChange={handleInputChange}
                                                    placeholder="ZIP Code"
                                                    className="transition-all focus:scale-[1.01]"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Images */}
                            <motion.div variants={cardVariants}>
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-600">
                                                <ImageIcon className="h-5 w-5" />
                                            </div>
                                            Property Images
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <motion.div
                                                className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                                                whileHover={{ scale: 1.01 }}
                                                whileTap={{ scale: 0.99 }}
                                            >
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="image-upload"
                                                />
                                                <label
                                                    htmlFor="image-upload"
                                                    className="cursor-pointer flex flex-col items-center"
                                                >
                                                    <motion.div
                                                        animate={{ y: [0, -5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                    >
                                                        <Upload className="h-12 w-12 text-primary/50 mb-3" />
                                                    </motion.div>
                                                    <span className="text-gray-600 font-medium">Click to upload images</span>
                                                    <span className="text-sm text-gray-400 mt-1">Maximum 10 images • JPG, PNG, WEBP</span>
                                                </label>
                                            </motion.div>

                                            <AnimatePresence>
                                                {previews.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                                                    >
                                                        {previews.map((preview, index) => (
                                                            <motion.div
                                                                key={index}
                                                                className="relative group"
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                transition={{ delay: index * 0.05 }}
                                                                whileHover={{ scale: 1.05 }}
                                                            >
                                                                <img
                                                                    src={preview}
                                                                    alt={`Preview ${index + 1}`}
                                                                    className="w-full h-32 object-cover rounded-xl shadow-lg"
                                                                />
                                                                <motion.button
                                                                    type="button"
                                                                    onClick={() => removeImage(index)}
                                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </motion.button>
                                                                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                                                    {index + 1}
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Amenities */}
                            <motion.div variants={cardVariants}>
                                <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden relative">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600">
                                                <Sparkles className="h-5 w-5" />
                                            </div>
                                            Amenities
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div>
                                            <Label htmlFor="amenities">Amenities (comma separated)</Label>
                                            <Input
                                                id="amenities"
                                                name="amenities"
                                                value={formData.amenities}
                                                onChange={handleInputChange}
                                                placeholder="e.g., Pool, Gym, Parking, Garden"
                                                className="transition-all focus:scale-[1.01]"
                                            />
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Submit */}
                            <motion.div
                                variants={cardVariants}
                                className="flex gap-4 pt-4"
                            >
                                <motion.div
                                    className="flex-1"
                                    whileHover={{ scale: loading ? 1 : 1.01 }}
                                    whileTap={{ scale: loading ? 1 : 0.99 }}
                                >
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-xl shadow-primary/25 transition-all"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                                Creating Property...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                                Create Property
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                                <Link href="/admin/properties">
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button type="button" variant="outline" size="lg" className="shadow-lg">
                                            Cancel
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </form>
                </div>
            </motion.div>
        </Layout>
    );
}
