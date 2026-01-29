import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../constant/constant.js'

// Send OTP
export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (phone , thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/auth/send-otp', { phone });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

// Verify OTP and login
export const verifyOTP = createAsyncThunk(
  'user/verifyOTP',
  async ({ phone, otp }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/auth/verify-otp', { phone, otp });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

// Register User 
export const registerUser = createAsyncThunk(
  'user/verifyOTP',
  async (formData, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/auth/register', formData);
      return data; 
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
);

// Get current logged-in user profile
export const getMyProfile = createAsyncThunk(
  'user/getMyProfile',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post('/user/me',{});
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/auth/logout');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);



// Initial state
const initialState = {
  user: null,
  userId: '',
  isAuthenticated: false,
  loading: true,
};

// User slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userExist : (state,action)=>{
          state.user = action.payload;
          state.userId = action.payload._id;
          state.isAuthenticated=true;
          state.loading = false;
    },
    userNotExist: (state)=>{
          state.user = null;
          state.userId = '';
          state.isAuthenticated = false;
          state.loading = false;
    }
    
  },
  extraReducers: (builder) => {
    builder
    .addCase(getMyProfile.pending, (state) => {
      state.loading = true;
    })
    .addCase(getMyProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    })
    .addCase(getMyProfile.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
     
  },
});

// Actions
export const { userExist, userNotExist } = userSlice.actions;

// Reducer
export default userSlice;
