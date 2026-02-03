import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { INDIA_CITIES } from '@/lib/indiaCities';
import axios from 'axios';

const API_URL = '/api/property';

// Top cities data
export const TOP_CITIES = [
    { name: 'Mumbai', state: 'Maharashtra', image: '/cities/mumbai.jpg' },
    { name: 'Delhi', state: 'Delhi', image: '/cities/delhi.jpg' },
    { name: 'Bangalore', state: 'Karnataka', image: '/cities/bangalore.jpg' },
    { name: 'Hyderabad', state: 'Telangana', image: '/cities/hyderabad.jpg' },
    { name: 'Chennai', state: 'Tamil Nadu', image: '/cities/chennai.jpg' },
    { name: 'Pune', state: 'Maharashtra', image: '/cities/pune.jpg' },
    { name: 'Kolkata', state: 'West Bengal', image: '/cities/kolkata.jpg' },
    { name: 'Ahmedabad', state: 'Gujarat', image: '/cities/ahmedabad.jpg' },
];

export const OTHER_CITIES = [
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Chandigarh', state: 'Punjab' },
    { name: 'Indore', state: 'Madhya Pradesh' },
    { name: 'Nagpur', state: 'Maharashtra' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Goa', state: 'Goa' },
    { name: 'Kochi', state: 'Kerala' },
    { name: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Surat', state: 'Gujarat' },
    { name: 'Vadodara', state: 'Gujarat' },
];

// Expanded India cities list
export { INDIA_CITIES };

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

// Get properties by city
export const getPropertiesByCity = createAsyncThunk(
    'property/getByCity',
    async (city, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(`${API_URL}/latest?city=${encodeURIComponent(city)}`);
            return { city, properties: data.properties || [] };
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
        cityProperties: [],
        selectedCity: 'Jaipur',
        currentProperty: null,
        loading: false,
        cityLoading: false,
        error: null,
    },
    reducers: {
        clearCurrentProperty: (state) => {
            state.currentProperty = null;
        },
        setSelectedCity: (state, action) => {
            state.selectedCity = action.payload;
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
            .addCase(getPropertiesByCity.pending, (state) => {
                state.cityLoading = true;
                state.error = null;
            })
            .addCase(getPropertiesByCity.fulfilled, (state, action) => {
                state.cityLoading = false;
                state.cityProperties = action.payload.properties;
            })
            .addCase(getPropertiesByCity.rejected, (state, action) => {
                state.cityLoading = false;
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

export const { clearCurrentProperty, setSelectedCity } = propertySlice.actions;
export default propertySlice.reducer;
