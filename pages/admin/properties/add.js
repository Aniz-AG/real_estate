import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ArrowLeft, Upload, X, Loader2, Building, MapPin, IndianRupee,
    Bed, Bath, Square, Image as ImageIcon, CheckCircle2, AlertCircle,
    Sparkles, Home, Compass, Calendar, Users, Layers, Car, Check
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Form Options
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

// Toast Component
const Toast = ({ message, type, onClose }) => (
    <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.9 }}
        className={`fixed bottom-6 right-6 z-[99999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
            }`}
    >
        {type === 'success' ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
        <span className="font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded-full p-1">
            <X className="h-4 w-4" />
        </button>
    </motion.div>
);

export default function AddProperty() {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [toast, setToast] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [activeSection, setActiveSection] = useState(0);
    const [mounted, setMounted] = useState(false);

    const [formData, setFormData] = useState({
        // Basic Info
        title: '',
        description: '',
        propertyCategory: 'residential',
        propertyType: 'flat',
        bhkType: '',
        usageType: 'sale',

        // Location
        address: '',
        locality: '',
        city: '',
        state: '',
        pincode: '',

        // Pricing
        price: '',
        pricePerSqft: '',
        isNegotiable: false,
        maintenanceCharges: '',

        // Area & Specs
        coveredArea: '',
        carpetArea: '',
        plotArea: '',
        bedrooms: '',
        bathrooms: '',
        balconies: '',

        // Floor Details
        floorNumber: '',
        totalFloors: '',

        // Property Details
        possessionStatus: '',
        possessionDate: '',
        saleType: '',
        facing: '',
        propertyAge: '',
        ownership: '',
        furnishing: '',
        postedByType: 'owner',

        // Amenities (will be an object)
        amenities: {},

        // Project/Builder Info
        projectName: '',
        builderName: '',

        // Contact Info
        contactPhone: '',
        contactEmail: '',

        // Flags
        isFeatured: false,
        isTopProject: false,
        isPremium: false,

        // Video
        videoUrl: '',
    });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role !== 'admin') {
            router.push('/');
        }
    }, [isAuthenticated, user, router, mounted]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 10) {
            showToast('Maximum 10 images allowed', 'error');
            return;
        }
        setImages(prev => [...prev, ...files]);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => setPreviews(prev => [...prev, reader.result]);
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
                if (key === 'amenities') {
                    // Append each amenity as separate field
                    Object.keys(formData.amenities).forEach(amenity => {
                        form.append(amenity, formData.amenities[amenity]);
                    });
                } else if (formData[key] !== '' && formData[key] !== undefined) {
                    form.append(key, formData[key]);
                }
            });

            setUploadProgress(30);

            // Append images
            images.forEach(image => form.append('images', image));

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
                setTimeout(() => router.push('/admin/properties'), 1500);
            } else {
                showToast(data.message || 'Failed to create property', 'error');
                setUploadProgress(0);
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Failed to create property', 'error');
            setUploadProgress(0);
        } finally {
            setLoading(false);
        }
    };

    // Show loading while mounted state is initializing
    if (!mounted) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            </Layout>
        );
    }

    // Redirect non-admins (useEffect handles this, but show loading while redirecting)
    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600">Checking authorization...</p>
                </div>
            </Layout>
        );
    }

    const sections = [
        { title: 'Basic Info', icon: Building },
        { title: 'Location', icon: MapPin },
        { title: 'Pricing', icon: IndianRupee },
        { title: 'Specifications', icon: Layers },
        { title: 'Features', icon: Home },
        { title: 'Amenities', icon: Car },
        { title: 'Images', icon: ImageIcon },
    ];

    return (
        <Layout>
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="mb-8">
                        <Link href="/admin/properties" className="inline-flex items-center text-primary hover:underline mb-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />Back to Properties
                        </Link>
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-primary text-white shadow-lg">
                                <Sparkles className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                                <p className="text-gray-500">Fill in the details to list a new property</p>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {loading && (
                        <div className="mb-6 bg-white rounded-lg p-4 shadow">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Uploading property...</span>
                                <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Section Navigation */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        {sections.map((section, index) => (
                            <button
                                key={section.title}
                                onClick={() => setActiveSection(index)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeSection === index
                                    ? 'bg-primary text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <section.icon className="h-4 w-4" />
                                {section.title}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Basic Info Section */}
                        {activeSection === 0 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Building className="h-5 w-5 text-primary" />Basic Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Property Title</Label>
                                        <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g., Beautiful 3BHK Flat in Prime Location" />
                                    </div>
                                    <div>
                                        <Label>Description *</Label>
                                        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe the property..." className="w-full min-h-[120px] px-3 py-2 border rounded-md" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Property Category *</Label>
                                            <select name="propertyCategory" value={formData.propertyCategory} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                {FORM_OPTIONS.propertyCategories.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Property Type *</Label>
                                            <select name="propertyType" value={formData.propertyType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                {FORM_OPTIONS.propertyTypes[formData.propertyCategory]?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Listing Type *</Label>
                                            <select name="usageType" value={formData.usageType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="sale">For Sale</option>
                                                <option value="rent">For Rent</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>BHK Type</Label>
                                            <select name="bhkType" value={formData.bhkType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select BHK</option>
                                                {FORM_OPTIONS.bhkOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Posted By</Label>
                                            <select name="postedByType" value={formData.postedByType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                {FORM_OPTIONS.postedByType.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Location Section */}
                        {activeSection === 1 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />Location Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label>Property Address *</Label>
                                        <Input name="address" value={formData.address} onChange={handleInputChange} placeholder="Full address" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Locality/Area</Label>
                                            <Input name="locality" value={formData.locality} onChange={handleInputChange} placeholder="e.g., Banjara Hills" />
                                        </div>
                                        <div>
                                            <Label>City *</Label>
                                            <Input name="city" value={formData.city} onChange={handleInputChange} placeholder="City" required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>State *</Label>
                                            <Input name="state" value={formData.state} onChange={handleInputChange} placeholder="State" required />
                                        </div>
                                        <div>
                                            <Label>Pincode *</Label>
                                            <Input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="6-digit pincode" maxLength={6} required />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Project Name (if any)</Label>
                                            <Input name="projectName" value={formData.projectName} onChange={handleInputChange} placeholder="e.g., DLF Cyber City" />
                                        </div>
                                        <div>
                                            <Label>Builder Name</Label>
                                            <Input name="builderName" value={formData.builderName} onChange={handleInputChange} placeholder="Builder/Developer name" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Pricing Section */}
                        {activeSection === 2 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <IndianRupee className="h-5 w-5 text-primary" />Pricing Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Price (₹) *</Label>
                                            <Input name="price" type="number" value={formData.price} onChange={handleInputChange} placeholder="Enter price" required />
                                        </div>
                                        <div>
                                            <Label>Price per sqft (₹)</Label>
                                            <Input name="pricePerSqft" type="number" value={formData.pricePerSqft} onChange={handleInputChange} placeholder="Price per sqft" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Maintenance Charges (₹/month)</Label>
                                            <Input name="maintenanceCharges" type="number" value={formData.maintenanceCharges} onChange={handleInputChange} placeholder="Monthly maintenance" />
                                        </div>
                                        <div className="flex items-center gap-2 pt-6">
                                            <input type="checkbox" id="isNegotiable" name="isNegotiable" checked={formData.isNegotiable} onChange={handleInputChange} className="w-4 h-4" />
                                            <Label htmlFor="isNegotiable" className="cursor-pointer">Price is Negotiable</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Specifications Section */}
                        {activeSection === 3 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Layers className="h-5 w-5 text-primary" />Property Specifications
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div>
                                            <Label>Bedrooms</Label>
                                            <Input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                        <div>
                                            <Label>Bathrooms</Label>
                                            <Input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                        <div>
                                            <Label>Balconies</Label>
                                            <Input name="balconies" type="number" value={formData.balconies} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                        <div>
                                            <Label>Total Floors</Label>
                                            <Input name="totalFloors" type="number" value={formData.totalFloors} onChange={handleInputChange} placeholder="0" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Covered Area (sqft)</Label>
                                            <Input name="coveredArea" type="number" value={formData.coveredArea} onChange={handleInputChange} placeholder="Super built-up area" />
                                        </div>
                                        <div>
                                            <Label>Carpet Area (sqft)</Label>
                                            <Input name="carpetArea" type="number" value={formData.carpetArea} onChange={handleInputChange} placeholder="Carpet area" />
                                        </div>
                                        <div>
                                            <Label>Plot Area (sqft)</Label>
                                            <Input name="plotArea" type="number" value={formData.plotArea} onChange={handleInputChange} placeholder="Plot area" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Floor Number</Label>
                                            <select name="floorNumber" value={formData.floorNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Floor</option>
                                                {FORM_OPTIONS.floor.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Facing</Label>
                                            <select name="facing" value={formData.facing} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Facing</option>
                                                {FORM_OPTIONS.facing.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Features Section */}
                        {activeSection === 4 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Home className="h-5 w-5 text-primary" />Property Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Possession Status</Label>
                                            <select name="possessionStatus" value={formData.possessionStatus} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Status</option>
                                                {FORM_OPTIONS.possessionStatus.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Sale Type</Label>
                                            <select name="saleType" value={formData.saleType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Type</option>
                                                {FORM_OPTIONS.saleType.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Ownership</Label>
                                            <select name="ownership" value={formData.ownership} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Ownership</option>
                                                {FORM_OPTIONS.ownership.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Furnishing</Label>
                                            <select name="furnishing" value={formData.furnishing} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Furnishing</option>
                                                {FORM_OPTIONS.furnishing.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label>Property Age</Label>
                                            <select name="propertyAge" value={formData.propertyAge} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md">
                                                <option value="">Select Age</option>
                                                {FORM_OPTIONS.propertyAge.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <Label>Video URL (YouTube/Vimeo)</Label>
                                            <Input name="videoUrl" value={formData.videoUrl} onChange={handleInputChange} placeholder="https://..." />
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleInputChange} className="w-4 h-4" />
                                            <Label htmlFor="isFeatured" className="cursor-pointer">Featured Property</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="isTopProject" name="isTopProject" checked={formData.isTopProject} onChange={handleInputChange} className="w-4 h-4" />
                                            <Label htmlFor="isTopProject" className="cursor-pointer">Top Project</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="isPremium" name="isPremium" checked={formData.isPremium} onChange={handleInputChange} className="w-4 h-4" />
                                            <Label htmlFor="isPremium" className="cursor-pointer">Premium Listing</Label>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Amenities Section */}
                        {activeSection === 5 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Car className="h-5 w-5 text-primary" />Amenities
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {FORM_OPTIONS.amenities.map(amenity => (
                                            <button
                                                type="button"
                                                key={amenity.value}
                                                onClick={() => handleAmenityToggle(amenity.value)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${formData.amenities[amenity.value]
                                                    ? 'bg-red-50 border-primary text-primary'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                {formData.amenities[amenity.value] && <Check className="h-4 w-4" />}
                                                {amenity.label}
                                            </button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Images Section */}
                        {activeSection === 6 && (
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-primary" />Property Images
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                                        <input type="file" id="images" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                                        <label htmlFor="images" className="cursor-pointer">
                                            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                            <p className="text-lg font-medium text-gray-700">Click to upload images</p>
                                            <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB (max 10 images)</p>
                                        </label>
                                    </div>

                                    {previews.length > 0 && (
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                                            {previews.map((preview, index) => (
                                                <div key={index} className="relative group aspect-square">
                                                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    {index === 0 && (
                                                        <span className="absolute bottom-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">Cover</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Navigation & Submit */}
                        <div className="flex justify-between mt-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setActiveSection(prev => Math.max(0, prev - 1))}
                                disabled={activeSection === 0}
                            >
                                Previous
                            </Button>

                            {activeSection < sections.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={() => setActiveSection(prev => prev + 1)}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Next
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-primary hover:bg-primary/90 min-w-[150px]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Property'
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
