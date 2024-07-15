import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/v1/wishlist');
      console.log('resonse : ', response.data);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (productId, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/wishlist', { productId });
      console.log('response : ', response);
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (productId, thunkAPI) => {
    try {
      const res = await axiosInstance.delete(`/api/v1/wishlist/${productId}`);
      console.log('res : ', res);

      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clear',
  async (_, thunkAPI) => {
    try {
      await axiosInstance.delete('/api/v1/wishlist');
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        console.log('fetch wishlist : ', action.payload);
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        console.log('add to cart : ', action.payload);
        state.items.push(action.payload);
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items?.filter(item => item.id !== action.payload);
      })
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
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

export default wishlistSlice.reducer;