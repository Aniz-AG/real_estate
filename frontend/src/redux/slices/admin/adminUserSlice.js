import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constant/constant.js';

// Fetch Users
export const getAdminUsers = createAsyncThunk(
    'user/getAdminUsers',
    async ({ keywords='', page=1 }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get(`/user/query?keywords=${keywords}&page=${page}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

// Update User
export const adminUserEdit = createAsyncThunk(
    'user/adminUpdateUser',
    async ({ userId, updateData }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.put(`/user/${userId}`, updateData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update user');
        }
    }
);

// Delete User
export const adminUserDelete = createAsyncThunk(
    'user/adminDeleteUser',
    async (id, thunkAPI) => {
        try {
            const { data } = await axiosInstance.delete(`/user/${id}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

// Initial State
const initialState = {
    users: {
        users: [],
        totalPage:1,
        loading:false,
    },
    updateUser: {
        loading: false,
    },
    deleteUser: {
        loading: false,
    }
};

// Admin User Slice
const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(getAdminUsers.pending, (state) => {
                state.users.loading = true;
            })
            .addCase(getAdminUsers.fulfilled, (state, action) => {
                state.users.loading = false;
                state.users.users = action.payload.users;
                state.users.totalPage = action.payload.totalPage;
            })
            .addCase(getAdminUsers.rejected, (state, action) => {
                state.users.loading = false;
            })

            // Update User
            .addCase(adminUserEdit.pending, (state) => {
                state.updateUser.loading = true;

            })
            .addCase(adminUserEdit.fulfilled, (state, action) => {
                state.updateUser.loading = false;

            })
            .addCase(adminUserEdit.rejected, (state, action) => {
                state.updateUser.loading = false;

            })

            // Delete User
            .addCase(adminUserDelete.pending, (state) => {
                state.deleteUser.loading = true;

            })
            .addCase(adminUserDelete.fulfilled, (state, action) => {
                state.deleteUser.loading = false;
                state.users.users = state.users.users.filter(user => user._id !== action.meta.arg);
            })
            .addCase(adminUserDelete.rejected, (state, action) => {
                state.deleteUser.loading = false;
            });
    }
});

export default adminUserSlice;
