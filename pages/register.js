import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AuroraBackground from '@/components/ui/aceternity/AuroraBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/redux/slices/userSlice';
import { User, Mail, Phone, MapPin, Upload, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name is too long'),
    email: z.string().email('Enter a valid email address'),
    phone: z.string().regex(/^\d{10}$/, 'Phone must be exactly 10 digits'),
    city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City is too long'),
    state: z.string().min(2, 'State must be at least 2 characters').max(50, 'State is too long'),
});

export default function Register() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, isAuthenticated } = useSelector((state) => state.user);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        city: '',
        state: '',
    });
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    // Don't render if authenticated
    if (isAuthenticated) {
        return null;
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form data with Zod
        const validation = registerSchema.safeParse(formData);
        if (!validation.success) {
            toast.error(validation.error.errors[0]?.message || 'Invalid form data');
            return;
        }

        if (!photo) {
            toast.error('Please upload your photo');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        data.append('photo', photo);

        try {
            await dispatch(registerUser(data)).unwrap();
            toast.success('Registration successful! Please login.');
            router.push('/login');
        } catch (error) {
            toast.error(error || 'Registration failed');
        }
    };

    return (
        <Layout>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
                <AuroraBackground />
                <div className="grid-overlay" aria-hidden />
                <div className="container relative mx-auto px-4 py-12">
                    <Card className="max-w-2xl mx-auto shadow-2xl bg-white/90 backdrop-blur-lg text-foreground animate-soft-up">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                            <CardDescription className="text-base">
                                Join us to find your dream property
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Full Name</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="username"
                                                name="username"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="10-digit number"
                                                value={formData.phone}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                                                    })
                                                }
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="city"
                                                name="city"
                                                type="text"
                                                placeholder="Your city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="state">State</Label>
                                        <Input
                                            id="state"
                                            name="state"
                                            type="text"
                                            placeholder="Your state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="photo">Profile Photo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <Input
                                                    id="photo"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoChange}
                                                    required
                                                />
                                            </div>
                                            {photoPreview && (
                                                <img
                                                    src={photoPreview}
                                                    alt="Preview"
                                                    className="h-20 w-20 rounded-full object-cover border-2 border-primary"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Creating Account...
                                        </>
                                    ) : 'Create Account'}
                                </Button>

                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground">
                                        Already have an account?{' '}
                                        <Link href="/login" className="text-primary font-semibold hover:underline">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
