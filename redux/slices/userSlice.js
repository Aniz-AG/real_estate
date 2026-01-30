import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api';

// Get my profile
export const getMyProfile = createAsyncThunk(
    'user/getMyProfile',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/user/me`);
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
        }
    }
);

// Register user
export const registerUser = createAsyncThunk(
    'user/register',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Send OTP
export const sendOtp = createAsyncThunk(
    'user/sendOtp',
    async (phone, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/send-otp`, { phone });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
        }
    }
);

// Verify OTP
export const verifyOtp = createAsyncThunk(
    'user/verifyOtp',
    async ({ phone, otp }, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
            if (data.token) {
                localStorage.setItem('token', data.token);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            }
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'OTP verification failed');
        }
    }
);

// Update Profile
export const updateProfile = createAsyncThunk(
    'user/updateProfile',
    async (formData, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(`${API_URL}/user/profile`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return data.user;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
        }
    }
);

// Logout
export const logout = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.post(`${API_URL}/auth/logout`);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return null;
    } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        return null;
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
    },
    reducers: {
        userExist: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        userNotExist: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Profile
            .addCase(getMyProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Profile
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { userExist, userNotExist } = userSlice.actions;
export default userSlice.reducer;
