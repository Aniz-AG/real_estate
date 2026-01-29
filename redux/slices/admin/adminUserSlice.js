import { createSlice } from '@reduxjs/toolkit';

const adminUserSlice = createSlice({
    name: 'adminUser',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {
        setUsers: (state, action) => {
            state.users = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setUsers, setLoading, setError } = adminUserSlice.actions;
export default adminUserSlice.reducer;
