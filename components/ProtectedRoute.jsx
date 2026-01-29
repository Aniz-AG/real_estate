import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { userExist, userNotExist } from '@/redux/slices/userSlice';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.user);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                dispatch(userNotExist());
                router.push('/login');
                return;
            }

            try {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                const { data } = await axios.get('/api/user/me');
                dispatch(userExist(data.user));
            } catch (error) {
                localStorage.removeItem('token');
                dispatch(userNotExist());
                router.push('/login');
            }
        };

        if (!isAuthenticated && !loading) {
            checkAuth();
        }
    }, [isAuthenticated, loading, dispatch, router]);

    if (loading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
