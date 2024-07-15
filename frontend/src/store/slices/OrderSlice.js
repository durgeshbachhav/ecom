
import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData, thunkAPI) => {
    try {
      console.log('order data : ', orderData)
      const response = await axiosInstance.post('/api/v1/order', orderData);
      console.log('create order response : ', response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getOrders = createAsyncThunk(
  'order/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/v1/order');
      console.log('get orders : ', response.data)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const getUserOrders = createAsyncThunk(
  'order/getUserAllOrder',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/order/user-orders`);
      console.log('response : ', response);
      return response.data.data; // Assuming your handleSuccess puts the data in a 'data' field
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (orderId, thunkAPI) => {
    try {
      const response = await axiosInstance.get(`/api/v1/order/${orderId}`);
      console.log('response : slice : ', response.data);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, status }, thunkAPI) => {
    try {
      const response = await axiosInstance.patch(`/api/v1/order/${orderId}`, { status });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  'order/delete',
  async (orderId, thunkAPI) => {
    try {
      await axiosInstance.delete(`/api/v1/order/${orderId}`);
      return orderId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
        state.currentOrder = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        console.log('action payload: ', action.payload)
        state.status = 'succeeded';
        state.orders = action.payload.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log('getOrderById slice : ', action.payload.data)
        state.currentOrder = action.payload.data;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload.data;
        }
        if (state.currentOrder && state.currentOrder.id === action.payload.id) {
          state.currentOrder = action.payload.data;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = state.orders.filter(o => o.id !== action.payload);
        if (state.currentOrder && state.currentOrder.id === action.payload) {
          state.currentOrder = null;
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

export default orderSlice.reducer;
export const selectUserOrder = (state) => state.order.orders;
export const selectCurrentOrder = (state) => state.order.currentOrder;