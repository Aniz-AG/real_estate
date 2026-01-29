import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import SeoHead from '@/components/SeoHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getMyProfile, logout } from '@/redux/slices/userSlice';
import { Mail, Phone, MapPin, User, LogOut, Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loader from '@/components/Loader';

export default function Profile() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector((state) => state.user);
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        dispatch(getMyProfile());
    }, [dispatch, isAuthenticated, router]);

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await dispatch(logout()).unwrap();
            toast.success('Logged out successfully');
            router.push('/');
        } catch (error) {
            toast.error('Failed to logout');
        } finally {
            setLogoutLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Loader />
                </div>
            </Layout>
        );
    }

    if (!user) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <p>Loading profile...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <SeoHead title="My Profile" description="View and manage your profile" />
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <Card className="shadow-xl">
                        <CardHeader className="text-center border-b pb-8">
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="w-32 h-32">
                                    <AvatarImage src={user.photo?.url} alt={user.username} />
                                    <AvatarFallback className="text-4xl">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-3xl font-bold">{user.username}</CardTitle>
                                    <p className="text-muted-foreground capitalize">{user.role}</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                        <Mail className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <p className="font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                        <Phone className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <p className="font-medium">{user.phone}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Location</p>
                                            <p className="font-medium">{user.city}, {user.state}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                                        <Heart className="h-5 w-5 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Liked Properties</p>
                                            <p className="font-medium">{user.likes?.length || 0} properties</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-wrap gap-4 justify-center">
                                <Link href="/browse">
                                    <Button variant="outline" size="lg">
                                        Browse Properties
                                    </Button>
                                </Link>
                                <Button
                                    variant="destructive"
                                    size="lg"
                                    onClick={handleLogout}
                                    disabled={logoutLoading}
                                    className="gap-2"
                                >
                                    {logoutLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <LogOut className="h-4 w-4" />
                                    )}
                                    {logoutLoading ? 'Logging out...' : 'Logout'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
