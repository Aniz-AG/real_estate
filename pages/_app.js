import { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import { getMyProfile } from '@/redux/slices/userSlice';
import { setSelectedCity, INDIA_CITIES } from '@/redux/slices/propertySlice';
import RouteProgressBar from '@/components/RouteProgressBar';
import axios from 'axios';
import '@/styles/globals.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Configure axios to send cookies with requests
axios.defaults.withCredentials = true;

// Auth wrapper component that checks for existing session
function AuthWrapper({ children }) {
    const dispatch = useDispatch();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        // Check if user is already logged in via cookies
        const checkAuth = async () => {
            try {
                await dispatch(getMyProfile()).unwrap();
            } catch (error) {
                // User is not logged in, that's fine
                console.log('No existing session found');
            } finally {
                setIsCheckingAuth(false);
            }
        };

        checkAuth();
    }, [dispatch]);

    useEffect(() => {
        if (isCheckingAuth) return;
        if (typeof window === 'undefined') return;

        const storedCity = localStorage.getItem('selectedCity');
        const preferredCity = storedCity || user?.city || 'Jaipur';

        dispatch(setSelectedCity(preferredCity));

        if (!storedCity) {
            localStorage.setItem('selectedCity', preferredCity);
        }

        // First-time anonymous visitor: try to detect their real city via
        // geolocation and override the 'Jaipur' fallback once/if it resolves.
        if (!storedCity && !user?.city && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const { latitude, longitude } = position.coords;
                        const res = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
                        );
                        const data = await res.json();
                        const detected =
                            data?.address?.city ||
                            data?.address?.town ||
                            data?.address?.village ||
                            data?.address?.county ||
                            data?.address?.state_district;

                        if (!detected) return;

                        const match = INDIA_CITIES.find(
                            (c) => c.name.toLowerCase() === detected.toLowerCase(),
                        );
                        if (match) {
                            dispatch(setSelectedCity(match.name));
                            localStorage.setItem('selectedCity', match.name);
                        }
                    } catch (error) {
                        // Silently keep the 'Jaipur' fallback if reverse geocoding fails
                    }
                },
                () => {
                    // Permission denied or unavailable — keep the 'Jaipur' fallback
                },
                { timeout: 8000 },
            );
        }
    }, [dispatch, isCheckingAuth, user]);

    // Show loading spinner while checking auth
    if (isCheckingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary animate-spin"></div>
                        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                    </div>
                    <p className="text-gray-600 animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    return children;
}

function AppContent({ Component, pageProps }) {
    return (
        <AuthWrapper>
            <RouteProgressBar />
            <Component {...pageProps} />
            <Toaster
                position="top-center"
                containerStyle={{
                    zIndex: 99999,
                }}
                toastOptions={{
                    style: {
                        zIndex: 99999,
                    },
                }}
            />
        </AuthWrapper>
    );
}

export default function App({ Component, pageProps }) {
    return (
        <Provider store={store}>
            <AppContent Component={Component} pageProps={pageProps} />
        </Provider>
    );
}
