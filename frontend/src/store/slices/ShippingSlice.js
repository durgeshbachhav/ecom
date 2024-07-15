import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const createShipping = createAsyncThunk(
     'shipping/createShipping',
     async (shippingData, { rejectWithValue }) => {
          try {
               const response = await axios.post('/api/shipping', shippingData);
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const getShipping = createAsyncThunk(
     'shipping/getShipping',
     async (id, { rejectWithValue }) => {
          try {
               const response = await axios.get(`/api/shipping/${id}`);
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const updateShippingStatus = createAsyncThunk(
     'shipping/updateShippingStatus',
     async ({ id, statusData }, { rejectWithValue }) => {
          try {
               const response = await axios.put(`/api/shipping/${id}`, statusData);
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

export const getAllDeliveries = createAsyncThunk(
     'shipping/getAllDeliveries',
     async (_, { rejectWithValue }) => {
          try {
               const response = await axios.get('/api/shipping');
               return response.data;
          } catch (error) {
               return rejectWithValue(error.response.data);
          }
     }
);

// Slice
const shippingSlice = createSlice({
     name: 'shipping',
     initialState: {
          shippings: [],
          currentShipping: null,
          loading: false,
          error: null,
     },
     reducers: {},
     extraReducers: (builder) => {
          builder
               .addCase(createShipping.pending, (state) => {
                    state.loading = true;
               })
               .addCase(createShipping.fulfilled, (state, action) => {
                    state.shippings.push(action.payload);
                    state.loading = false;
               })
               .addCase(createShipping.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
               })
               .addCase(getShipping.pending, (state) => {
                    state.loading = true;
               })
               .addCase(getShipping.fulfilled, (state, action) => {
                    state.currentShipping = action.payload;
                    state.loading = false;
               })
               .addCase(getShipping.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
               })
               .addCase(updateShippingStatus.pending, (state) => {
                    state.loading = true;
               })
               .addCase(updateShippingStatus.fulfilled, (state, action) => {
                    const index = state.shippings.findIndex(s => s.id === action.payload.id);
                    if (index !== -1) {
                         state.shippings[index] = action.payload;
                    }
                    state.loading = false;
               })
               .addCase(updateShippingStatus.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
               })
               .addCase(getAllDeliveries.pending, (state) => {
                    state.loading = true;
               })
               .addCase(getAllDeliveries.fulfilled, (state, action) => {
                    state.shippings = action.payload;
                    state.loading = false;
               })
               .addCase(getAllDeliveries.rejected, (state, action) => {
                    state.error = action.payload;
                    state.loading = false;
               });
     },
});

export default shippingSlice.reducer;