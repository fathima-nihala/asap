import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BasicInfo, BasicInfoResponse, User } from '../../types/basictype';


interface BasicInfoState {
  user: User | null;
  basicInfo: BasicInfo | null;
  loading: boolean;
  error: string | null;
}

const initialState: BasicInfoState = { 
  user: null,
  basicInfo: null,
  loading: false,
  error: null,
};

// Async thunk to fetch basic info
export const fetchBasicInfo = createAsyncThunk<
  BasicInfoResponse,
  void,
  { rejectValue: string }
>('basicInfo/fetchBasicInfo', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<BasicInfoResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/basic-info`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch basic info');
  }
});

// Async thunk to update basic info
export const updateBasicInfo = createAsyncThunk<
  BasicInfoResponse,
  BasicInfo,
  { rejectValue: string }
>('basicInfo/updateBasicInfo', async (basicInfoData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put<BasicInfoResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/basic-info`,
      basicInfoData,
      {
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to update basic info');
  }
});

const basicInfoSlice = createSlice({
  name: 'basicInfo',
  initialState,
  reducers: {
    resetBasicInfo: (state) => {
      state.user = null;
      state.basicInfo = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.basicInfo = action.payload.data.basicInfo;
      })
      .addCase(fetchBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Something went wrong';
      })
      .addCase(updateBasicInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBasicInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.basicInfo = action.payload.data.basicInfo;
      })
      .addCase(updateBasicInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update';
      });
  },
});

export const { resetBasicInfo } = basicInfoSlice.actions;
export default basicInfoSlice.reducer;
