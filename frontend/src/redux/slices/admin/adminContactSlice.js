import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../constant/constant.js';

// create contact request
export const newContactRequest = createAsyncThunk(
    'user/newContactRequest',
    async ({ name, email, phone,message }, thunkAPI) => {

        try {
            const { data } = await axiosInstance.post(`/contact/new`,{
                name,
                email,
                phone,
                message
            });
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);
// Fetch Contact
export const getAllContacts = createAsyncThunk(
    'user/getAdminContact',
    async ({status="", page=1}, thunkAPI) => {
        try {
            const { data } = await axiosInstance.get(`/contact/all?status=${status}&page=${page}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);


// Update Contact
export const adminContactUpdate = createAsyncThunk(
    'user/adminUpdateContact', 
    async ({ contactId, newStatus }, thunkAPI) => {
      try {
        const { data } = await axiosInstance.put(
          `/contact/${contactId}`, 
          { newStatus } 
        );
        return data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || 'Failed to update contact'
        );
      }
    }
  );
  

// Delete Contact
export const adminContactDelete = createAsyncThunk(
    'user/adminDeleteContact',
    async (id, thunkAPI) => {
        try {
            const { data } = await axiosInstance.delete(`/contact/${id}`);
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

// Initial State
const initialState = {
    requestContact:{
         loading:false
    },
    getAllContact:{
         loading:false,
         totalPages:1,
         contacts:[],
    },
    updateConatct:{
         loading:false,
    },
    deleteContact:{
         loading:false
    }


};

// Admin User Slice
const adminContactSlice = createSlice({
    name: 'adminContact',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // newContactRequest
            .addCase(newContactRequest.pending, (state) => {
                state.requestContact.loading = true;
            })
            .addCase(newContactRequest.fulfilled, (state, action) => {
                state.requestContact.loading = false;
                state.requestContact.response = action.payload;
            })
            .addCase(newContactRequest.rejected, (state, action) => {
                state.requestContact.loading = false;
                state.requestContact.error = action.payload;
            })

            // getAllContacts
            .addCase(getAllContacts.pending, (state) => {
                state.getAllContact.loading = true;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.getAllContact.loading = false;
                state.getAllContact.totalPages = action.payload.totalPage;
                state.getAllContact.contacts = action.payload.contacts || [];
            })
            .addCase(getAllContacts.rejected, (state) => {
                state.getAllContact.loading = false;
            })

            // adminContactUpdate
            .addCase(adminContactUpdate.pending, (state) => {
                state.updateConatct.loading = true;
            })
            .addCase(adminContactUpdate.fulfilled, (state, action) => {
                state.updateConatct.loading = false;
                state.updateConatct.response = action.payload;
            })
            .addCase(adminContactUpdate.rejected, (state, action) => {
                state.updateConatct.loading = false;
                state.updateConatct.error = action.payload;
            })

            // adminUserDelete
            .addCase(adminContactDelete.pending, (state) => {
                state.deleteContact.loading = true;
            })
            .addCase(adminContactDelete.fulfilled, (state,) => {
                state.deleteContact.loading = false;
            })
            .addCase(adminContactDelete.rejected, (state,) => {
                state.deleteContact.loading = false;
            });
    }
});


export default adminContactSlice;
