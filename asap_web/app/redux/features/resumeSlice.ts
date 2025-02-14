

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ResumesState, DocumentResume, VideoResume, GetResumesResponse, UploadResumeResponse, ErrorResponse } from '../../types/resume.type';

const initialState: ResumesState = {
  documents: [],
  videos: [],
  isLoading: false,
  error: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';

// Fetch Resumes
export const fetchResumes = createAsyncThunk(
  'resumes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<GetResumesResponse>(
        `${API_URL}/resumes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to fetch resumes');
    }
  }
);

// Upload Document Resume
export const uploadDocumentResume = createAsyncThunk(
  'resumes/uploadDocument',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<UploadResumeResponse>(
        `${API_URL}/document`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as DocumentResume;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to upload document');
    }
  }
);

// Upload Video Resume
export const uploadVideoResume = createAsyncThunk(
  'resumes/uploadVideo',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post<UploadResumeResponse>(
        `${API_URL}/video`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as VideoResume;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to upload video');
    }
  }
);

// Update Document Resume
export const updateDocumentResume = createAsyncThunk(
  'resumes/updateDocument',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put<UploadResumeResponse>(
        `${API_URL}/document/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data as DocumentResume;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to update document');
    }
  }
);

// Delete Document Resume
export const deleteDocumentResume = createAsyncThunk(
  'resumes/deleteDocument',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/document/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to delete document');
    }
  }
);

// Delete Video Resume
export const deleteVideoResume = createAsyncThunk(
  'resumes/deleteVideo',
  async (id: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (error) {
      const err = error as AxiosError;
      return rejectWithValue((err.response?.data as ErrorResponse)?.message || 'Failed to delete video');
    }
  }
);

const resumesSlice = createSlice({
  name: 'resumes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload.documents;
        state.videos = action.payload.videos;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadDocumentResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadDocumentResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents.unshift(action.payload);
      })
      .addCase(uploadDocumentResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadVideoResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadVideoResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.videos.unshift(action.payload);
      })
      .addCase(uploadVideoResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDocumentResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateDocumentResume.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documents.findIndex((doc) => doc._id === action.payload._id);
        if (index !== -1) {
          state.documents[index] = action.payload;
        }
      })
      .addCase(updateDocumentResume.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteDocumentResume.fulfilled, (state, action) => {
        state.documents = state.documents.filter((doc) => doc._id !== action.payload);
      })
      .addCase(deleteDocumentResume.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteVideoResume.fulfilled, (state, action) => {
        state.videos = state.videos.filter((video) => video._id !== action.payload);
      })
      .addCase(deleteVideoResume.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = resumesSlice.actions;
export default resumesSlice.reducer;
