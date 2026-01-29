import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import AuroraBackground from '@/components/ui/aceternity/AuroraBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { sendOtp, verifyOtp } from '@/redux/slices/userSlice';
import { Phone, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { loading, isAuthenticated } = useSelector((state) => state.user);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // Local state for immediate UI feedback

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/');
        }
    }, [isAuthenticated, router]);

    const handleSendOtp = async (e) => {
        e.preventDefault();

        // Prevent multiple clicks - return early if already submitting
        if (isSubmitting) return;

        if (phone.length !== 10) {
            toast.error('Please enter a valid 10-digit phone number');
            return;
        }

        // Immediately disable button (optimistic UI)
        setIsSubmitting(true);

        try {
            const result = await dispatch(sendOtp(phone)).unwrap();
            toast.success(result.message || 'OTP sent successfully');
            setOtpSent(true);
        } catch (error) {
            toast.error(error || 'Failed to send OTP');
        } finally {
            // Re-enable button after request completes
            setIsSubmitting(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        // Prevent multiple clicks
        if (isSubmitting) return;

        if (otp.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }

        setIsSubmitting(true);

        try {
            await dispatch(verifyOtp({ phone, otp })).unwrap();
            toast.success('Login successful!');
            router.replace('/');
        } catch (error) {
            toast.error(error || 'Invalid OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Don't render login page if authenticated
    if (isAuthenticated) {
        return null;
    }

    return (
        <Layout>
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-900 text-white">
                <AuroraBackground />
                <div className="grid-overlay" aria-hidden />
                <div className="container relative mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <Card className="w-full max-w-md shadow-2xl bg-white/90 backdrop-blur-lg text-foreground animate-soft-up">
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                            <CardDescription className="text-base">
                                {otpSent ? 'Enter the OTP sent to your phone' : 'Login to continue to your account'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {!otpSent ? (
                                <form onSubmit={handleSendOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="Enter 10-digit phone number"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="pl-10"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    {/* 
                                        Button with color fade transition:
                                        - transition-all: enables smooth transitions for all CSS properties
                                        - duration-300: transition takes 300ms
                                        - When disabled/submitting: opacity reduces, cursor changes, bg color fades
                                    */}
                                    <Button
                                        type="submit"
                                        className={`w-full transition-all duration-300 ease-in-out ${isSubmitting
                                                ? 'bg-primary/70 cursor-not-allowed scale-[0.99]'
                                                : 'hover:bg-primary/90 hover:scale-[1.01]'
                                            }`}
                                        size="lg"
                                        disabled={isSubmitting || loading}
                                    >
                                        {isSubmitting || loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Sending OTP...
                                            </>
                                        ) : 'Send OTP'}
                                    </Button>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyOtp} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="otp">Enter OTP</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="otp"
                                                type="text"
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                className="pl-10 text-center tracking-widest text-lg"
                                                required
                                                disabled={isSubmitting}
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="submit"
                                        className={`w-full transition-all duration-300 ease-in-out ${isSubmitting
                                                ? 'bg-primary/70 cursor-not-allowed scale-[0.99]'
                                                : 'hover:bg-primary/90 hover:scale-[1.01]'
                                            }`}
                                        size="lg"
                                        disabled={isSubmitting || loading}
                                    >
                                        {isSubmitting || loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Verifying...
                                            </>
                                        ) : 'Verify OTP'}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="w-full transition-all duration-200"
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Change Phone Number
                                    </Button>
                                </form>
                            )}

                            <div className="mt-6 text-center">
                                <p className="text-sm text-muted-foreground">
                                    Don't have an account?{' '}
                                    <Link href="/register" className="text-primary font-semibold hover:underline">
                                        Sign Up
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
