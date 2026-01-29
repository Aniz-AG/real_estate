import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../constant/constant.js'


// latest properties 
export const getLatestProperty = createAsyncThunk(
  'user/latestProperty',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/property/latest', {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)

// get single  properties 
export const getSingleProperty = createAsyncThunk(
  'user/latestProperty',
  async (id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/property/get/${id}`, {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)

// top cities
export const getTopCities = createAsyncThunk(
  'user/top-cities',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/property/top-cities', {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)

// get Agents
export const getAgents = createAsyncThunk(
  'user/getAgents',
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get('/property/agents', {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)
// get sginleAgent
export const getSingleAgent = createAsyncThunk(
  'user/getSingleAgent',
  async (_id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/property/agent/${_id}`, {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message || 'User Register failed';
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)


// get Agents
export const getAgentProperty = createAsyncThunk(
  'user/getAgentProperty',
  async (_id, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get(`/property/agent/properties/${_id}`, {});
      return data;
    } catch (error) {
      // In case of an error, use rejectWithValue to pass a custom error message
      const errorMessage = error.response?.data?.message;
      console.error('Registration error:', errorMessage); // Optional: Log the error for debugging
      return thunkAPI.rejectWithValue(errorMessage); // Reject with the error message
    }
  }
)


// get filtered property...
export const getFilteredProperties = createAsyncThunk(
  'property/getFilteredProperties',
  async ({ filters, page }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.post(
        `/property/search?page=${page}`,
        filters
      );
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Something went wrong';
      return thunkAPI.rejectWithValue(errorMessage);
    }
})



// Initial state
const initialState = {
  latestProperty: [],
  topCities: [],
  agents: [],
  filteredProperty: {
    properties: [],
    totalPage: 0,
    loading: false
  },
};

// User slice
export const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {


  },
  extraReducers: (builder) => {
    builder
      .addCase(getLatestProperty.pending, (state, action) => {
        state.latestProperty = [];
      })

      .addCase(getLatestProperty.fulfilled, (state, action) => {
        state.latestProperty = action.payload.properties;
      })

      .addCase(getLatestProperty.rejected, (state) => {
        state.latestProperty = [];
      })

      .addCase(getTopCities.pending, (state) => {
        state.topCities = [];
      })

      .addCase(getTopCities.fulfilled, (state, action) => {
        state.topCities = action.payload.cities;
      })

      .addCase(getTopCities.rejected, (state) => {
        state.topCities = [];
      })

      .addCase(getAgents.pending, (state) => {
        state.agents = [];
      })

      .addCase(getAgents.fulfilled, (state, action) => {
        state.agents = action.payload.agents;
      })

      .addCase(getAgents.rejected, (state) => {
        state.agents = [];
      })

      .addCase(getFilteredProperties.pending, (state) => {
        state.filteredProperty.loading = true;
      })
      .addCase(getFilteredProperties.fulfilled, (state, action) => {
        state.filteredProperty.properties = action.payload.properties;
        state.filteredProperty.totalPage = action.payload.totalPage;
        state.filteredProperty.loading = false;
      })
      .addCase(getFilteredProperties.rejected, (state) => {
        state.filteredProperty.properties = [];
        state.filteredProperty.loading = false;

      })
    
  },
});

// Actions
export const { } = propertySlice.actions;

// slice
export default propertySlice;
