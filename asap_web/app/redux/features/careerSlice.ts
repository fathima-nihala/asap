import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { CareerState, UpdateCareerPayload } from '../../types/career.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const initialState: CareerState = {
  careerObjective: null,
  isLoading: false,
  error: null,
};

interface ErrorResponse {
  message: string;
}

export const fetchCareerObjective = createAsyncThunk(
  'career/fetchCareerObjective',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/career`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Something went wrong');
    }
  }
);

export const updateCareerObjective = createAsyncThunk(
  'career/updateCareerObjective',
  async ({ payload }: { userId: string; payload: UpdateCareerPayload }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/career`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to update');
    }
  }
);

const careerSlice = createSlice({
  name: 'career',
  initialState,
  reducers: {
    resetCareerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCareerObjective.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCareerObjective.fulfilled, (state, action) => {
        state.isLoading = false;
        state.careerObjective = action.payload;
        state.error = null;
      })
      .addCase(fetchCareerObjective.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCareerObjective.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCareerObjective.fulfilled, (state, action) => {
        state.isLoading = false;
        state.careerObjective = action.payload;
        state.error = null;
      })
      .addCase(updateCareerObjective.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCareerError } = careerSlice.actions;

export const selectCareerObjective = (state: { career: CareerState }) => state.career.careerObjective;
export const selectCareerLoading = (state: { career: CareerState }) => state.career.isLoading;
export const selectCareerError = (state: { career: CareerState }) => state.career.error;

export default careerSlice.reducer;