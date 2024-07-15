import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createReview = createAsyncThunk(
  'review/create',
  async (reviewData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/review', reviewData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getReviewsByProduct = createAsyncThunk(
  'review/getByProduct',
  async (productId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/review/${productId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getReviewsByUser = createAsyncThunk(
  'review/getByUser',
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/review/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  'review/update',
  async ({ reviewId, reviewData }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/api/v1/review/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/delete',
  async (reviewId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/review/${reviewId}`);
      return reviewId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    reviews: [],
    status: 'idle',
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(createReview.fulfilled, (state, action) => {
        console.log('reviews : ', action.payload);
        state.status = 'succeeded';
        if (Array.isArray(state.reviews)) {
          state.reviews.push(action.payload.data);
        } else {
          state.reviews = [action.payload.data];
        }
      })
      .addCase(getReviewsByProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload.data;
      })
      .addCase(getReviewsByUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = action.payload;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.reviews.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reviews = state.reviews.filter(r => r.id !== action.payload);
      })
      .addMatcher(
        (action) => action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export default reviewSlice.reducer;

export const selectAllReviews = (state) => state.review.reviews;