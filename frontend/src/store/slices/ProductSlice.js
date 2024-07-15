import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { axiosInstance, guestAxiosInstance } from '../../api/AxiosInstace';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, thunkAPI) => {
    try {
      const response = await guestAxiosInstance.get('/api/v1/product');

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, thunkAPI) => {
    try {
      console.log
      const response = await guestAxiosInstance.get(`/api/v1/product/${productId}`);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const addProduct = createAsyncThunk(
  'products/add',
  async (formData, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/product/add-new-product`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {

      return thunkAPI.rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ productId, productData }, thunkAPI) => {
    try {

      const response = await axiosInstance.patch(`/api/v1/product/update-product/${productId}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (productId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/product/delete-product/${productId}`);
      return productId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    items: [],
    currentItem: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.data;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentItem = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {

        state.items.push = action.payload.data;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {

        if (Array.isArray(state.items)) {
          const index = state.items.findIndex(item => item?.id === action.payload.id);
          if (index !== -1) {
            state.items[index] = action.payload;
          }
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        if (Array.isArray(state.items)) {
          state.items = state.items.filter(item => item.id !== action.payload);
        }
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

export default productSlice.reducer;


export const selectAllProducts = (state) => state.product.items;

export const selectCurrentProduct = (state) => state.product.currentItem.data;
// export const selectCurrentProduct = (state) => state.product.currentItem;

export const selectProductStatus = (state) => state.product.status;
export const selectProductError = (state) => state.product.error;