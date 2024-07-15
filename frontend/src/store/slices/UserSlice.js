import { axiosInstance } from '@/api/AxiosInstace';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/user/register`, userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const loginUser = createAsyncThunk(
  'user/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/api/v1/user/login`, userData);
      // console.log('Login response: ========response.data.message======', response.data);
      return response.data.message;
    } catch (error) {
      // console.error('Login error:', error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.post('/api/v1/user/logout');
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


export const changePassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, thunkAPI) => {
    try {
      const response = await axios.axiosInstance('/api/v1/user/change-password', passwordData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (avatarData, thunkAPI) => {
    try {
      const response = await axiosInstance.patch('/api/v1/user/update-avatar', avatarData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchAccountDetails = createAsyncThunk(
  'user/fetchAccountDetails',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/v1/user/account-details');
      // console.log('fetchAccountDetails : ', response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateUserDetails = createAsyncThunk(
  'user/updateDetails',
  async (userData, thunkAPI) => {

    try {
      console.log('user data : ', userData);
      const response = await axiosInstance.patch(`/api/v1/user/update-user-details`, userData);
      // console.log('update user details :response.data.message.user ', response.data.message);

      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


//only for admin

export const fetchAllAccounts = createAsyncThunk(
  'user/fetchAllDetails',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/api/v1/user/all-users');
      // console.log('fetchAllAccounts : ', response)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const changeUserRole = createAsyncThunk(
  'user/changeRole',
  async ({ email, newRole }, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/api/v1/user/change-role`,
        { email, newRole },
        { withCredentials: true }
      );
      console.log('change user role slice response : ',response);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);


const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    allUsers: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      // console.log('action google payload : ', action.payload)
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.currentUser = action.payload;
        state.status = 'succeeded';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        // console.log('Login fulfilled payload:', action.payload);
        state.currentUser = action.payload.user; // Store just the user object
        state.status = 'succeeded';
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        localStorage.setItem('accessToken', action.payload.accessToken);
        // console.log('User stored in localStorage:', localStorage.getItem('user'));
        // console.log('Access token stored:', localStorage.getItem('accessToken'));
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        localStorage.setItem('user', "");
        localStorage.setItem('accessToken', "");
        localStorage.setItem('refreshToken', "");
        state.status = 'idle';
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        // console.log('fetch account detail s: ', action.payload);
        state.currentUser = action.payload.data;
        state.status = 'succeeded';
      })
      .addCase(updateUserDetails.fulfilled, (state, action) => {
        // console.log('update user details : ', action.payload);
        state.currentUser = action.payload.user; // Ensure we're storing just the user object
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        state.status = 'succeeded';
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        console.log('action payload chnageuserRole : ',action.payload);
        state.currentUser = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        state.status = 'succeeded';
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchAllAccounts.fulfilled, (state, action) => {
        // console.log('fetchAllAccounts paylod : ', action.payload);
        state.allUsers = action.payload.data;
        state.status = 'succeeded';
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

export const { setUser } = userSlice.actions;

export default userSlice.reducer;

// export current user 
export const selectCurrentUser = (state) => state.user.currentUser;
export const selectAllUser = (state) => state.user.allUsers; 
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;