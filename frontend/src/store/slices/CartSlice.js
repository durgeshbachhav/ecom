import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/cart/${userId}`);
      console.log('response data : ', response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/add',
  async (productData, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/cart', productData);
      console.log('response data : ', response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async ({ productId, userId }, thunkAPI) => {
    try {
      const response = await axiosInstance.delete('/api/v1/cart', { data: { productId, userId } });
      console.log('remove response data : ', response)
      return { productId, userId };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  'cart/increase',
  async ({ productId, userId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/cart/increase', { productId, userId });
      console.log('increase response data : ', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  'cart/decrease',
  async ({ productId, userId }, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/cart/decrease', { productId, userId });
      console.log('decrease response data : ', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);
export const deleteUserCart = createAsyncThunk(
  'cart/deleteUserCart',
  async (userId, thunkAPI) => {
    try {
      const response = await axiosInstance.delete(`/api/v1/cart/${userId}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
    setCartTotalQuantity: (state, action) => {
      state.totalQuantity = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // localStorage.setItem('wishlist', JSON.stringify(action.payload.data.products));
        state.items = action.payload.data.products;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const newItem = action.payload.data;
        const existingItem = state.items?.find(item => item.product._id === newItem.product._id);
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.product._id !== action.payload.productId);
      })
      .addCase(increaseQuantity.fulfilled, (state, action) => {
        const item = state.items?.find(item => item?.product?._id === action.payload?.data?.product?._id);
        if (item) {
          item.quantity = action.payload.data.quantity;
        }
      })
      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        const item = state.items.find(item => item.product._id === action.payload.data.product._id);
        if (item) {
          item.quantity = action.payload.data.quantity;
        }
      })
      .addCase(deleteUserCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = []; // Clear the cart items
      })
      .addCase(deleteUserCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
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

export const { clearCart, setCartTotalQuantity } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCartItems = state => state.cart.items;
export const selectCartStatus = state => state.cart.status;
export const selectCartTotalQuantity = state =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);