import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { 
  WorkExperienceState, 
  WorkExperienceRequest, 
  WorkExperienceResponse,
  WorkExperiencesResponse
} from '../../types/work.type';

const initialState: WorkExperienceState = {
  items: [],
  loading: false,
  error: null,
  currentOperation: 'idle'
};

// Fetch all work experiences
export const fetchWorkExperiences = createAsyncThunk<
  WorkExperiencesResponse,
  void,
  { rejectValue: string }
>('workExperience/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get<WorkExperiencesResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/work`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || 'Failed to fetch work experiences'
    );
  }
});

// Add work experience
export const addWorkExperience = createAsyncThunk<
  WorkExperienceResponse,
  WorkExperienceRequest,
  { rejectValue: string }
>('workExperience/add', async (workData, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post<WorkExperienceResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/work`,
      workData,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || 'Failed to add work experience'
    );
  }
});

// Edit work experience
export const editWorkExperience = createAsyncThunk<
  WorkExperienceResponse,
  { id: string; data: WorkExperienceRequest },
  { rejectValue: string }
>('workExperience/edit', async ({ id, data }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put<WorkExperienceResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/work/${id}`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    return rejectWithValue(
      err.response?.data?.message || 'Failed to update work experience'
    );
  }
});

const workExperienceSlice = createSlice({
  name: 'workExperience',
  initialState,
  reducers: {
    clearWorkExperienceError: (state) => {
      state.error = null;
    },
    resetWorkExperienceState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch all work experiences
    builder.addCase(fetchWorkExperiences.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWorkExperiences.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload.data;
    });
    builder.addCase(fetchWorkExperiences.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An unknown error occurred';
    });

    // Add work experience
    builder.addCase(addWorkExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentOperation = 'adding';
    });
    builder.addCase(addWorkExperience.fulfilled, (state, action) => {
      state.loading = false;
      state.items.push(action.payload.data);
      state.currentOperation = 'idle';
    });
    builder.addCase(addWorkExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An unknown error occurred';
      state.currentOperation = 'idle';
    });

    // Edit work experience
    builder.addCase(editWorkExperience.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.currentOperation = 'editing';
    });
    builder.addCase(editWorkExperience.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(
        (item) => item._id === action.payload.data._id
      );
      if (index !== -1) {
        state.items[index] = action.payload.data;
      }
      state.currentOperation = 'idle';
    });
    builder.addCase(editWorkExperience.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'An unknown error occurred';
      state.currentOperation = 'idle';
    });
  },
});

export const { 
  clearWorkExperienceError, 
  resetWorkExperienceState 
} = workExperienceSlice.actions;

export default workExperienceSlice.reducer;