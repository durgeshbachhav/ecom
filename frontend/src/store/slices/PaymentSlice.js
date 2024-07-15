import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// export const verifyPayment = createAsyncThunk(
//      'payment/verify',
//      async (paymentData, thunkAPI) => {
//           try {
//                console.log('payment data : ', paymentData)
//                const response = await axiosInstance.post('/api/v1/payment/verify-payment', paymentData);
//                console.log('pyament response : ', response)
//                return response.data;
//           } catch (error) {
//                return thunkAPI.rejectWithValue(error.response.data);
//           }
//      }
// );


export const verifyPayment = createAsyncThunk(
     'payment/verify',
     async (paymentData, thunkAPI) => {
          try {
               console.log('payment data  thunk: ', paymentData);
               const response = await axiosInstance.post('/api/v1/payment/verify-payment', {
                    razorpay_order_id: paymentData.razorpay_order_id,
                    razorpay_payment_id: paymentData.razorpay_payment_id,
                    razorpay_signature: paymentData.razorpay_signature,
                    amount: paymentData.amount,
                    receiptId: paymentData.receiptId,
                    orderId: paymentData.orderId
               });
               console.log('payment response : ', response);
               return response.data;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response.data);
          }
     }
);

export const fetchPayments = createAsyncThunk(
     'payment/fetchAll',
     async (_, thunkAPI) => {
          try {
               const response = await axios.get('/api/v1/payment');
               return response.data;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response.data);
          }
     }
);

export const fetchPaymentById = createAsyncThunk(
     'payment/fetchById',
     async (paymentId, thunkAPI) => {
          try {
               const response = await axios.get(`/api/v1/payment/${paymentId}`);
               return response.data;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response.data);
          }
     }
);

export const updatePaymentStatus = createAsyncThunk(
     'payment/updateStatus',
     async ({ paymentId, status }, thunkAPI) => {
          try {
               const response = await axios.put(`/api/v1/payment/${paymentId}/update`, { status });
               return response.data;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response.data);
          }
     }
);

export const deletePayment = createAsyncThunk(
     'payment/delete',
     async (paymentId, thunkAPI) => {
          try {
               await axios.delete(`/api/v1/payment/${paymentId}/delete`);
               return paymentId;
          } catch (error) {
               return thunkAPI.rejectWithValue(error.response.data);
          }
     }
);

const paymentSlice = createSlice({
     name: 'payment',
     initialState: {
          payments: [],
          currentPayment: null,
          status: 'idle',
          error: null,
     },
     reducers: {},
     extraReducers: (builder) => {
          builder
               .addCase(verifyPayment.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.currentPayment = action.payload;
               })
               .addCase(fetchPayments.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.payments = action.payload;
               })
               .addCase(fetchPaymentById.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.currentPayment = action.payload;
               })
               .addCase(updatePaymentStatus.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    const index = state.payments.findIndex(p => p.id === action.payload.id);
                    if (index !== -1) {
                         state.payments[index] = action.payload;
                    }
                    if (state.currentPayment && state.currentPayment.id === action.payload.id) {
                         state.currentPayment = action.payload;
                    }
               })
               .addCase(deletePayment.fulfilled, (state, action) => {
                    state.status = 'succeeded';
                    state.payments = state.payments.filter(p => p.id !== action.payload);
                    if (state.currentPayment && state.currentPayment.id === action.payload) {
                         state.currentPayment = null;
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

export default paymentSlice.reducer;