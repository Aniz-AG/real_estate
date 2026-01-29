import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constant/constant.js';


// Fetch Properties
export const getAdminProperties = createAsyncThunk(
    'property/getAdminProperties',
    async ({ keywords='', page=1 }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get(`/property/query?page=${page}&keywords=${keywords}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
        }
    }
);

// Update Property
export const adminUpdateProperty = createAsyncThunk(
    'property/adminUpdateProperty',
    async ({ id, formData }, thunkAPI) => {
        try {
            const { data } = await axiosInstance.put(`/property/${id}`, formData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update property');
        }
    }
);

// Delete Property
export const adminDeleteProperty = createAsyncThunk(
    'property/adminDeleteProperty',
    async (id, thunkAPI) => {
        try {
            const { data } = await axiosInstance.delete(`/property/${id}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete property');
        }
    }
);


// Delete Property
export const addProperty = createAsyncThunk(
    'property/addProperty',
    async (formData, thunkAPI) => {
        try {
            const { data } = await axiosInstance.post(`/property/add`,formData);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete property');
        }
    }
);

// Initial State
const initialState = {
    properties: {
        properties: [],
        loading: false,
        totalPage: 1,
    },
    adminSingleProperty: {
        property: {},
        loading: false,
    },
    updateProperty: {
        loading: false,
        success: null,
    },
    deleteProperty: {
        loading: false,
        success: null,
    },
    addProperty:{
        updateLoading:false,
        success:false,
    }
};

// Admin Property Slice
const adminPropertySlice = createSlice({
    name: 'adminProperty',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // Get Admin Properties
            .addCase(getAdminProperties.pending, (state) => {
                state.properties.loading = true;  
            })
            .addCase(getAdminProperties.fulfilled, (state, action) => {
                state.properties.properties = action.payload?.properties || [];
                state.properties.totalPage = action.payload?.totalPage || 1;   //
                state.properties.loading = false;
            })
            .addCase(getAdminProperties.rejected, (state) => {
                state.properties.properties = [];
                state.properties.loading = false;
            })

            // Update Property
            .addCase(adminUpdateProperty.pending, (state) => {
                state.updateProperty.updateLoading = true;
            })
            .addCase(adminUpdateProperty.fulfilled, (state) => {
                state.updateProperty.updateLoading = false;
                state.updateProperty.success = true;
            })
            .addCase(adminUpdateProperty.rejected, (state) => {
                state.updateProperty.updateLoading = false;
                state.updateProperty.success = false;
            })

            // Delete Property
            .addCase(adminDeleteProperty.pending, (state) => {
                state.deleteProperty.loading = true;
            })
            .addCase(adminDeleteProperty.fulfilled, (state) => {
                state.deleteProperty.loading = false;
                state.deleteProperty.success = true;
            })
            .addCase(adminDeleteProperty.rejected, (state) => {
                state.deleteProperty.loading = false;
                state.deleteProperty.success = false;
            })
            // add Property
            .addCase(addProperty.pending, (state) => {
                state.addProperty.loading = true;
            })
            .addCase(addProperty.fulfilled, (state) => {
                state.addProperty.loading = false;
                state.addProperty.success = true;
            })
            .addCase(addProperty.rejected, (state) => {
                state.addProperty.loading = false;
                state.addProperty.success = false;
            })
    }
});

export default adminPropertySlice;
