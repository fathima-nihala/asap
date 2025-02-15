import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { PortfolioResponse, PortfolioState, UpdatePortfolioRequest } from '../../types/protfolio.tyes';

const initialState: PortfolioState = {
  data: null,
  loading: false,
  error: null
};

export const fetchPortfolio = createAsyncThunk<
  PortfolioResponse,
  void,
  { rejectValue: string }
>('portfolio/fetchPortfolio', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<PortfolioResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch portfolio');
  }
});

export const updatePortfolio = createAsyncThunk<
  PortfolioResponse,
  UpdatePortfolioRequest,
  { rejectValue: string }
>('portfolio/updatePortfolio', async (portfolioData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put<PortfolioResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/portfolio`,
      portfolioData,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(err.response?.data?.message || 'Failed to update portfolio');
  }
});

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearPortfolioError: (state) => {
      state.error = null;
    },
    resetPortfolio: () => initialState
  },
  extraReducers: (builder) => {
    // Fetch portfolio cases
    builder.addCase(fetchPortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPortfolio.fulfilled, (state, action: PayloadAction<PortfolioResponse>) => {
      state.loading = false;
      state.data = action.payload.portfolio;
    });
    builder.addCase(fetchPortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An unknown error occurred';
    });

    // Update portfolio cases
    builder.addCase(updatePortfolio.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updatePortfolio.fulfilled, (state, action: PayloadAction<PortfolioResponse>) => {
      state.loading = false;
      state.data = action.payload.portfolio;
    });
    builder.addCase(updatePortfolio.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An unknown error occurred';
    });
  }
});

export const { clearPortfolioError, resetPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;