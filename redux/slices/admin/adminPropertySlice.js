import { createSlice } from '@reduxjs/toolkit';

const adminPropertySlice = createSlice({
    name: 'adminProperty',
    initialState: {
        properties: [],
        loading: false,
        error: null,
    },
    reducers: {
        setProperties: (state, action) => {
            state.properties = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setProperties, setLoading, setError } = adminPropertySlice.actions;
export default adminPropertySlice.reducer;
