import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { EducationState, Education, AddEducationResponse, EducationFetchResponse, EditEducationResponse } from '../../types/edu.type';

interface ErrorResponse {
    message: string;
  }

const initialState: EducationState = {
  educationList: [],
  loading: false,
  error: null,
};

// Async thunk for adding education
export const addEducation = createAsyncThunk(
  'education/addEducation',
  async (educationData: Omit<Education, '_id'>, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.post<AddEducationResponse>(`${process.env.NEXT_PUBLIC_API_URL}/edu`, educationData,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      return response.data.education;
    } catch (error) {
      const err = error as AxiosError; // Casting to AxiosError
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Something went wrong');
    }
  }
);


export const fetchEducation = createAsyncThunk(
  'education/fetchEducation',
  async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.get<EducationFetchResponse>(`${process.env.NEXT_PUBLIC_API_URL}/edu`,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      return response.data.education;
    } catch (error) {
      const err = error as AxiosError; 
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Something went wrong');
    }
  }
);

// Async thunk for editing education
export const editEducation = createAsyncThunk(
  'education/editEducation',
  async ({ id, educationData }: { id: string; educationData: Education }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
      const response = await axios.put<EditEducationResponse>(`${process.env.NEXT_PUBLIC_API_URL}/edu/${id}`, educationData,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );
      return response.data.education;
    } catch (error) {
      const err = error as AxiosError; 
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Something went wrong');
    }
  }
);

// Education slice
const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle fetch education
    builder.addCase(fetchEducation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchEducation.fulfilled, (state, action) => {
      state.loading = false;
      state.educationList = action.payload;
    });
    builder.addCase(fetchEducation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle add education
    builder.addCase(addEducation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addEducation.fulfilled, (state, action) => {
      state.loading = false;
      state.educationList.push(action.payload);
    });
    builder.addCase(addEducation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Handle edit education
    builder.addCase(editEducation.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(editEducation.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.educationList.findIndex((edu) => edu._id === action.payload._id);
      if (index !== -1) {
        state.educationList[index] = action.payload;
      }
    });
    builder.addCase(editEducation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default educationSlice.reducer;
