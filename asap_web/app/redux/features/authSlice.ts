import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { AuthState, User, ApiError } from '../../types/auth.types';

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

export const loginUser = createAsyncThunk<
  { user: User; token: string }, 
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ user: User; token: string }>(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        credentials
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Login failed'
      );
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<{ user: User }>(
        `${process.env.NEXT_PUBLIC_API_URL}/reg`,
        userData
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Registration failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{ success: boolean }>(
        `${process.env.NEXT_PUBLIC_API_URL}/logout`
      );
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Logout failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;