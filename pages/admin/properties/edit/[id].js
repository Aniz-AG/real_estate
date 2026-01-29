import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Upload, X, Check, Loader2, ImageIcon,
    MapPin, Home, IndianRupee, Bed, Bath, Maximize
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm ${type === 'success'
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

export default function EditProperty() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        property_address: '',
        city: '',
        state: '',
        pincode: '',
        property_type: 'house',
        usage_type: 'Sale',
        price: '',
        square_feet: '',
        nums_bedrooms: '',
        nums_bathrooms: '',
        description: '',
    });
    const [existingPhotos, setExistingPhotos] = useState([]);
    const [newPhotos, setNewPhotos] = useState([]);
    const [photosToRemove, setPhotosToRemove] = useState([]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }
        if (user?.role !== 'admin') {
            router.replace('/');
            return;
        }
    }, [isAuthenticated, user, router]);

    useEffect(() => {
        if (id && isAuthenticated && user?.role === 'admin') {
            fetchProperty();
        }
    }, [id, isAuthenticated, user]);

    const fetchProperty = async () => {
        try {
            const res = await axios.get(`/api/property/${id}`);
            const property = res.data.property;

            setFormData({
                property_address: property.address?.property_address || '',
                city: property.address?.city || '',
                state: property.address?.state || '',
                pincode: property.address?.pincode || '',
                property_type: property.property_type || 'house',
                usage_type: property.usage_type || 'Sale',
                price: property.price?.toString() || '',
                square_feet: property.square_feet?.toString() || '',
                nums_bedrooms: property.nums_bedrooms?.toString() || '',
                nums_bathrooms: property.nums_bathrooms?.toString() || '',
                description: property.description || '',
            });
            setExistingPhotos(property.photos || []);
        } catch (error) {
            console.error('Error fetching property:', error);
            showToast('Failed to fetch property details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + existingPhotos.length - photosToRemove.length + newPhotos.length > 10) {
            showToast('Maximum 10 photos allowed', 'error');
            return;
        }
        setNewPhotos(prev => [...prev, ...files]);
    };

    const removeExistingPhoto = (index) => {
        const photo = existingPhotos[index];
        setPhotosToRemove(prev => [...prev, photo.public_id]);
        setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const removeNewPhoto = (index) => {
        setNewPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.property_address || !formData.city || !formData.state || !formData.price) {
            showToast('Please fill all required fields', 'error');
            return;
        }

        setSaving(true);
        setUploadProgress(0);

        try {
            const data = new FormData();

            // Append form fields
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Append new photos
            newPhotos.forEach(photo => {
                data.append('photos', photo);
            });

            // Append photos to remove
            if (photosToRemove.length > 0) {
                data.append('photosToRemove', JSON.stringify(photosToRemove));
            }

            // Append existing photos that are kept
            data.append('existingPhotos', JSON.stringify(existingPhotos));

            const res = await axios.put(`/api/admin/properties?id=${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            });

            if (res.data.success) {
                showToast('Property updated successfully!');
                setTimeout(() => {
                    router.push('/admin/properties');
                }, 1500);
            }
        } catch (error) {
            console.error('Error updating property:', error);
            showToast(error.response?.data?.message || 'Failed to update property', 'error');
        } finally {
            setSaving(false);
            setUploadProgress(0);
        }
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

    if (loading) {
        return (
            <Layout>
                <SeoHead title="Edit Property - Admin" />
                <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 flex items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SeoHead title="Edit Property - Admin" />

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
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <motion.div
                        className="flex items-center gap-4 mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Link href="/admin/properties">
                            <Button variant="outline" size="icon" className="rounded-xl">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Edit Property
                            </h1>
                            <p className="text-muted-foreground">
                                Update property information
                            </p>
                        </div>
                    </motion.div>

                    {/* Upload Progress */}
                    <AnimatePresence>
                        {saving && uploadProgress > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-6"
                            >
                                <div className="bg-white rounded-xl p-4 shadow-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Uploading...</span>
                                        <span className="text-sm text-primary font-semibold">{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-primary to-blue-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit}>
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Photos Section */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" />
                                        Property Photos
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {/* Existing Photos */}
                                    {existingPhotos.length > 0 && (
                                        <div className="mb-4">
                                            <Label className="mb-2 block">Current Photos</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {existingPhotos.map((photo, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={photo.url}
                                                            alt={`Property ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingPhoto(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* New Photos */}
                                    {newPhotos.length > 0 && (
                                        <div className="mb-4">
                                            <Label className="mb-2 block">New Photos</Label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {newPhotos.map((photo, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={URL.createObjectURL(photo)}
                                                            alt={`New ${index + 1}`}
                                                            className="w-full h-24 object-cover rounded-lg"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeNewPhoto(index)}
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Upload Button */}
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Click to add more photos</span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </CardContent>
                            </Card>

                            {/* Address Section */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        Address Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="property_address">Property Address *</Label>
                                        <Input
                                            id="property_address"
                                            name="property_address"
                                            value={formData.property_address}
                                            onChange={handleChange}
                                            placeholder="Enter full address"
                                            className="mt-1 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                            className="mt-1 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                            className="mt-1 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input
                                            id="pincode"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            placeholder="Enter pincode"
                                            className="mt-1 rounded-lg"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Property Details */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Home className="h-5 w-5" />
                                        Property Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="property_type">Property Type</Label>
                                        <select
                                            id="property_type"
                                            name="property_type"
                                            value={formData.property_type}
                                            onChange={handleChange}
                                            className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background"
                                        >
                                            <option value="house">House</option>
                                            <option value="apartment">Apartment</option>
                                            <option value="villa">Villa</option>
                                            <option value="plot">Plot</option>
                                            <option value="commercial">Commercial</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="usage_type">Usage Type</Label>
                                        <select
                                            id="usage_type"
                                            name="usage_type"
                                            value={formData.usage_type}
                                            onChange={handleChange}
                                            className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background"
                                        >
                                            <option value="Sale">Sale</option>
                                            <option value="Rent">Rent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="price">Price (₹) *</Label>
                                        <Input
                                            id="price"
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            placeholder="Enter price"
                                            className="mt-1 rounded-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="square_feet">Square Feet</Label>
                                        <Input
                                            id="square_feet"
                                            name="square_feet"
                                            type="number"
                                            value={formData.square_feet}
                                            onChange={handleChange}
                                            placeholder="Enter area"
                                            className="mt-1 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nums_bedrooms">Bedrooms</Label>
                                        <Input
                                            id="nums_bedrooms"
                                            name="nums_bedrooms"
                                            type="number"
                                            value={formData.nums_bedrooms}
                                            onChange={handleChange}
                                            placeholder="Number of bedrooms"
                                            className="mt-1 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nums_bathrooms">Bathrooms</Label>
                                        <Input
                                            id="nums_bathrooms"
                                            name="nums_bathrooms"
                                            type="number"
                                            value={formData.nums_bathrooms}
                                            onChange={handleChange}
                                            placeholder="Number of bathrooms"
                                            className="mt-1 rounded-lg"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="description">Description</Label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Enter property description..."
                                            className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background resize-none"
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Link href="/admin/properties" className="flex-1">
                                    <Button type="button" variant="outline" className="w-full h-12 rounded-xl">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 h-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 rounded-xl shadow-lg"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-5 w-5 mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
