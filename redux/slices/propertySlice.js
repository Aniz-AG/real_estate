import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/property';

// Get latest properties
export const getLatestProperties = createAsyncThunk(
    'property/getLatest',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/latest`);
            return data.properties;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch properties');
        }
    }
);

// Search properties
export const searchProperties = createAsyncThunk(
    'property/search',
    async (searchParams, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(`${API_URL}/search`, searchParams);
            return data.properties;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Search failed');
        }
    }
);

// Get single property
export const getProperty = createAsyncThunk(
    'property/getOne',
    async (id, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/${id}`);
            return data.property;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch property');
        }
    }
);

const propertySlice = createSlice({
    name: 'property',
    initialState: {
        properties: [],
        currentProperty: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentProperty: (state) => {
            state.currentProperty = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLatestProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLatestProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
            })
            .addCase(getLatestProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(searchProperties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchProperties.fulfilled, (state, action) => {
                state.loading = false;
                state.properties = action.payload;
            })
            .addCase(searchProperties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getProperty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getProperty.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProperty = action.payload;
            })
            .addCase(getProperty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCurrentProperty } = propertySlice.actions;
export default propertySlice.reducer;
