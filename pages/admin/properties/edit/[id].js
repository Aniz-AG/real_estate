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
    MapPin, Home, IndianRupee, Bed, Bath, Maximize,
    Layers, Users, Car, Phone
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

const FORM_OPTIONS = {
    propertyCategories: [
        { label: 'Residential', value: 'residential' },
        { label: 'Commercial', value: 'commercial' },
        { label: 'Other', value: 'other' },
    ],
    propertyTypes: {
        residential: [
            { label: 'Flat/Apartment', value: 'flat' },
            { label: 'Multistorey Apartment', value: 'multistorey_apartment' },
            { label: 'Builder Floor', value: 'builder_floor' },
            { label: 'Penthouse', value: 'penthouse' },
            { label: 'Studio Apartment', value: 'studio_apartment' },
            { label: 'Residential House', value: 'residential_house' },
            { label: 'Villa', value: 'villa' },
            { label: 'Plot/Land', value: 'plot' },
        ],
        commercial: [
            { label: 'Office Space', value: 'office_space' },
            { label: 'Shop/Showroom', value: 'shop' },
            { label: 'Commercial Land', value: 'commercial_land' },
            { label: 'Warehouse/Godown', value: 'warehouse' },
            { label: 'Industrial Building', value: 'industrial_building' },
            { label: 'Industrial Shed', value: 'industrial_shed' },
        ],
        other: [
            { label: 'Agricultural Land', value: 'agricultural_land' },
            { label: 'Farm House', value: 'farm_house' },
        ],
    },
    bhkOptions: ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK', '5+ BHK'],
    possessionStatus: [
        { label: 'Ready to Move', value: 'ready_to_move' },
        { label: 'Under Construction', value: 'under_construction' },
    ],
    saleType: [
        { label: 'New', value: 'new' },
        { label: 'Resale', value: 'resale' },
    ],
    ownership: [
        { label: 'Freehold', value: 'freehold' },
        { label: 'Leasehold', value: 'leasehold' },
        { label: 'Power of Attorney', value: 'power_of_attorney' },
        { label: 'Co-operative Society', value: 'cooperative_society' },
    ],
    furnishing: [
        { label: 'Furnished', value: 'furnished' },
        { label: 'Semi-Furnished', value: 'semi_furnished' },
        { label: 'Unfurnished', value: 'unfurnished' },
    ],
    facing: [
        { label: 'East', value: 'east' },
        { label: 'West', value: 'west' },
        { label: 'North', value: 'north' },
        { label: 'South', value: 'south' },
        { label: 'North-East', value: 'north-east' },
        { label: 'North-West', value: 'north-west' },
        { label: 'South-East', value: 'south-east' },
        { label: 'South-West', value: 'south-west' },
    ],
    floor: [
        { label: 'Basement', value: 'basement' },
        { label: 'Ground', value: 'ground' },
        { label: '1-4', value: '1-4' },
        { label: '5-8', value: '5-8' },
        { label: '9-12', value: '9-12' },
        { label: '13-16', value: '13-16' },
        { label: '16+', value: '16+' },
    ],
    propertyAge: [
        { label: 'Under Construction', value: 'under_construction' },
        { label: 'Less than 1 year', value: 'less_than_1_year' },
        { label: '1 to 5 years', value: '1_to_5_years' },
        { label: '5 to 10 years', value: '5_to_10_years' },
        { label: 'More than 10 years', value: 'more_than_10_years' },
    ],
    postedByType: [
        { label: 'Owner', value: 'owner' },
        { label: 'Agent', value: 'agent' },
        { label: 'Builder', value: 'builder' },
    ],
    amenities: [
        { label: 'Reserved Parking', value: 'reserved_parking' },
        { label: 'Visitor Parking', value: 'visitor_parking' },
        { label: 'Lift', value: 'lift' },
        { label: 'Power Backup', value: 'power_backup' },
        { label: 'Gas Pipeline', value: 'gas_pipeline' },
        { label: 'Park', value: 'park' },
        { label: 'Kids Play Area', value: 'kids_play_area' },
        { label: 'Gymnasium', value: 'gymnasium' },
        { label: 'Swimming Pool', value: 'swimming_pool' },
        { label: 'Club House', value: 'club_house' },
        { label: 'Security', value: 'security' },
        { label: 'CCTV', value: 'cctv' },
        { label: 'Fire Safety', value: 'fire_safety' },
        { label: 'Water Storage', value: 'water_storage' },
        { label: 'Rain Water Harvesting', value: 'rain_water_harvesting' },
        { label: 'Intercom', value: 'intercom' },
    ],
};

export default function EditProperty() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        property_category: 'residential',
        property_type: 'flat',
        bhk_type: '',
        usage_type: 'sale',

        property_address: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',

        price: '',
        price_per_sqft: '',
        is_negotiable: false,
        maintenance_charges: '',

        covered_area: '',
        carpet_area: '',
        plot_area: '',
        square_feet: '',
        nums_bedrooms: '',
        nums_bathrooms: '',
        nums_balconies: '',

        floor_number: '',
        total_floors: '',

        possession_status: '',
        possession_date: '',
        status: 'available',
        sale_type: '',
        facing: '',
        property_age: '',
        ownership: '',
        furnishing: '',
        posted_by_type: '',

        amenities: {},

        project_name: '',
        builder_name: '',

        contact_phone: '',
        contact_email: '',

        is_verified: false,
        is_featured: false,
        is_top_project: false,
        is_premium: false,

        video_url: '',
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
                title: property.title || '',
                description: property.description || '',
                property_category: property.property_category || 'residential',
                property_type: property.property_type || 'flat',
                bhk_type: property.bhk_type || '',
                usage_type: property.usage_type || 'sale',

                property_address: property.address?.property_address || '',
                locality: property.address?.locality || '',
                city: property.address?.city || '',
                state: property.address?.state || '',
                pincode: property.address?.pincode || '',

                price: property.price?.toString() || '',
                price_per_sqft: property.price_per_sqft?.toString() || '',
                is_negotiable: !!property.is_negotiable,
                maintenance_charges: property.maintenance_charges?.toString() || '',

                covered_area: property.covered_area?.toString() || '',
                carpet_area: property.carpet_area?.toString() || '',
                plot_area: property.plot_area?.toString() || '',
                square_feet: property.square_feet?.toString() || '',
                nums_bedrooms: property.nums_bedrooms?.toString() || '',
                nums_bathrooms: property.nums_bathrooms?.toString() || '',
                nums_balconies: property.nums_balconies?.toString() || '',

                floor_number: property.floor_number || '',
                total_floors: property.total_floors?.toString() || '',

                possession_status: property.possession_status || '',
                possession_date: property.possession_date ? new Date(property.possession_date).toISOString().slice(0, 10) : '',
                status: property.status || 'available',
                sale_type: property.sale_type || '',
                facing: property.facing || '',
                property_age: property.property_age || '',
                ownership: property.ownership || '',
                furnishing: property.furnishing || '',
                posted_by_type: property.posted_by_type || '',

                amenities: property.amenities || {},

                project_name: property.project_name || '',
                builder_name: property.builder_name || '',

                contact_phone: property.contact_phone || '',
                contact_email: property.contact_email || '',

                is_verified: !!property.is_verified,
                is_featured: !!property.is_featured,
                is_top_project: !!property.is_top_project,
                is_premium: !!property.is_premium,

                video_url: property.video_url || '',
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
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleAmenityToggle = (amenity) => {
        setFormData(prev => ({
            ...prev,
            amenities: {
                ...prev.amenities,
                [amenity]: !prev.amenities[amenity]
            }
        }));
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
                if (key === 'amenities') {
                    data.append(key, JSON.stringify(formData.amenities || {}));
                    return;
                }
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

                            {/* Basic Info */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Home className="h-5 w-5" /> Basic Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div>
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" name="title" value={formData.title} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="property_category">Property Category</Label>
                                            <select id="property_category" name="property_category" value={formData.property_category} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                                {FORM_OPTIONS.propertyCategories.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="property_type">Property Type</Label>
                                            <select id="property_type" name="property_type" value={formData.property_type} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                                {FORM_OPTIONS.propertyTypes[formData.property_category || 'residential'].map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="bhk_type">BHK Type</Label>
                                            <select id="bhk_type" name="bhk_type" value={formData.bhk_type} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                                <option value="">Select</option>
                                                {FORM_OPTIONS.bhkOptions.map(bhk => (
                                                    <option key={bhk} value={bhk}>{bhk}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <Label htmlFor="usage_type">Usage Type</Label>
                                            <select id="usage_type" name="usage_type" value={formData.usage_type} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                                <option value="sale">Sale</option>
                                                <option value="rent">Rent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 w-full px-3 py-2 rounded-lg border border-input bg-background resize-none" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Location */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" /> Location
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <Label htmlFor="property_address">Property Address *</Label>
                                        <Input id="property_address" name="property_address" value={formData.property_address} onChange={handleChange} className="mt-1 rounded-lg" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="locality">Locality</Label>
                                        <Input id="locality" name="locality" value={formData.locality} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="city">City *</Label>
                                        <Input id="city" name="city" value={formData.city} onChange={handleChange} className="mt-1 rounded-lg" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="state">State *</Label>
                                        <Input id="state" name="state" value={formData.state} onChange={handleChange} className="mt-1 rounded-lg" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="pincode">Pincode</Label>
                                        <Input id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Pricing */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-rose-500 to-red-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <IndianRupee className="h-5 w-5" /> Pricing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="price">Price (₹) *</Label>
                                        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} className="mt-1 rounded-lg" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="price_per_sqft">Price per sqft</Label>
                                        <Input id="price_per_sqft" name="price_per_sqft" type="number" value={formData.price_per_sqft} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="maintenance_charges">Maintenance Charges</Label>
                                        <Input id="maintenance_charges" name="maintenance_charges" type="number" value={formData.maintenance_charges} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div className="flex items-center gap-2 mt-6">
                                        <input id="is_negotiable" name="is_negotiable" type="checkbox" checked={formData.is_negotiable} onChange={handleChange} className="h-4 w-4" />
                                        <Label htmlFor="is_negotiable">Price Negotiable</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Area & Specs */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Maximize className="h-5 w-5" /> Area & Specs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label htmlFor="covered_area">Covered Area</Label>
                                        <Input id="covered_area" name="covered_area" type="number" value={formData.covered_area} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="carpet_area">Carpet Area</Label>
                                        <Input id="carpet_area" name="carpet_area" type="number" value={formData.carpet_area} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="plot_area">Plot Area</Label>
                                        <Input id="plot_area" name="plot_area" type="number" value={formData.plot_area} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="square_feet">Square Feet</Label>
                                        <Input id="square_feet" name="square_feet" type="number" value={formData.square_feet} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="nums_bedrooms">Bedrooms</Label>
                                        <Input id="nums_bedrooms" name="nums_bedrooms" type="number" value={formData.nums_bedrooms} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="nums_bathrooms">Bathrooms</Label>
                                        <Input id="nums_bathrooms" name="nums_bathrooms" type="number" value={formData.nums_bathrooms} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="nums_balconies">Balconies</Label>
                                        <Input id="nums_balconies" name="nums_balconies" type="number" value={formData.nums_balconies} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="total_floors">Total Floors</Label>
                                        <Input id="total_floors" name="total_floors" type="number" value={formData.total_floors} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Floor & Possession */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Layers className="h-5 w-5" /> Floor & Possession
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="floor_number">Floor Number</Label>
                                        <select id="floor_number" name="floor_number" value={formData.floor_number} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.floor.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="possession_status">Possession Status</Label>
                                        <select id="possession_status" name="possession_status" value={formData.possession_status} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.possessionStatus.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="possession_date">Possession Date</Label>
                                        <Input id="possession_date" name="possession_date" type="date" value={formData.possession_date} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="available">Available</option>
                                            <option value="sold">Sold</option>
                                            <option value="rented">Rented</option>
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Features */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Home className="h-5 w-5" /> Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="sale_type">Sale Type</Label>
                                        <select id="sale_type" name="sale_type" value={formData.sale_type} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.saleType.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="facing">Facing</Label>
                                        <select id="facing" name="facing" value={formData.facing} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.facing.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="property_age">Property Age</Label>
                                        <select id="property_age" name="property_age" value={formData.property_age} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.propertyAge.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="ownership">Ownership</Label>
                                        <select id="ownership" name="ownership" value={formData.ownership} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.ownership.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="furnishing">Furnishing</Label>
                                        <select id="furnishing" name="furnishing" value={formData.furnishing} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.furnishing.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label htmlFor="posted_by_type">Posted By</Label>
                                        <select id="posted_by_type" name="posted_by_type" value={formData.posted_by_type} onChange={handleChange} className="mt-1 w-full h-10 px-3 rounded-lg border border-input bg-background">
                                            <option value="">Select</option>
                                            {FORM_OPTIONS.postedByType.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Amenities */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5" /> Amenities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {FORM_OPTIONS.amenities.map((amenity) => (
                                            <label key={amenity.value} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={!!formData.amenities?.[amenity.value]}
                                                    onChange={() => handleAmenityToggle(amenity.value)}
                                                    className="h-4 w-4"
                                                />
                                                {amenity.label}
                                            </label>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Project/Builder */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="h-5 w-5" /> Project/Builder
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="project_name">Project Name</Label>
                                        <Input id="project_name" name="project_name" value={formData.project_name} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="builder_name">Builder Name</Label>
                                        <Input id="builder_name" name="builder_name" value={formData.builder_name} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-cyan-500 to-sky-500 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <Phone className="h-5 w-5" /> Contact Info
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="contact_phone">Contact Phone</Label>
                                        <Input id="contact_phone" name="contact_phone" value={formData.contact_phone} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                    <div>
                                        <Label htmlFor="contact_email">Contact Email</Label>
                                        <Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleChange} className="mt-1 rounded-lg" />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Flags & Media */}
                            <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5" /> Flags & Media
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                            <input id="is_verified" name="is_verified" type="checkbox" checked={formData.is_verified} onChange={handleChange} className="h-4 w-4" />
                                            <Label htmlFor="is_verified">Verified</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input id="is_featured" name="is_featured" type="checkbox" checked={formData.is_featured} onChange={handleChange} className="h-4 w-4" />
                                            <Label htmlFor="is_featured">Featured</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input id="is_top_project" name="is_top_project" type="checkbox" checked={formData.is_top_project} onChange={handleChange} className="h-4 w-4" />
                                            <Label htmlFor="is_top_project">Top Project</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input id="is_premium" name="is_premium" type="checkbox" checked={formData.is_premium} onChange={handleChange} className="h-4 w-4" />
                                            <Label htmlFor="is_premium">Premium</Label>
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="video_url">Video URL</Label>
                                        <Input id="video_url" name="video_url" value={formData.video_url} onChange={handleChange} className="mt-1 rounded-lg" />
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
