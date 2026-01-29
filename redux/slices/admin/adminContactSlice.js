import { createSlice } from '@reduxjs/toolkit';

const adminContactSlice = createSlice({
    name: 'adminContact',
    initialState: {
        contacts: [],
        loading: false,
        error: null,
    },
    reducers: {
        setContacts: (state, action) => {
            state.contacts = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setContacts, setLoading, setError } = adminContactSlice.actions;
export default adminContactSlice.reducer;
