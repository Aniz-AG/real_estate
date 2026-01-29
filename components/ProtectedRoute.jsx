import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    useEffect(() => {
        // Wait for auth check to complete, then redirect if not authenticated
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
            </div>
        );
    }

    // Not authenticated - will redirect
    if (!isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
