import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { SkillsState, Skill, SkillResponse } from "../../types/skill.types";


interface ErrorResponse {
  message: string;
}

const initialState: SkillsState = {
  skills: [],
  loading: false,
  error: null,
};

// Fetch all skills
export const fetchSkills = createAsyncThunk(
  "skills/fetchSkills",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/skill`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Direct assignment since backend returns the skills array directly
      return response.data;
    } catch (error) {
      const err = error as AxiosError<ErrorResponse>;
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch skills"
      );
    }
  }
);

// Add a new skill
export const addSkill = createAsyncThunk<
  Skill[],
  string,
  { rejectValue: string }
>("skills/addSkill", async (skillName, {dispatch, rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post<SkillResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/skill`,
      { skillName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchSkills());
    return response.data.skills;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to add skill"
    );
  }
});

// Remove a skill
export const removeSkill = createAsyncThunk<
  Skill[],
  string,
  { rejectValue: string }
>("skills/removeSkill", async (skillId, { dispatch, rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete<SkillResponse>(
      `${process.env.NEXT_PUBLIC_API_URL}/skill/${skillId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(fetchSkills());
    return response.data.skills;
  } catch (error) {
    const err = error as AxiosError<ErrorResponse>;
    return rejectWithValue(
      err.response?.data?.message || "Failed to remove skill"
    );
  }
});

const skillsSlice = createSlice({
  name: "skills",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch skills";
      })
      .addCase(addSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload; // Set the updated skills array
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add skill";
      })
      .addCase(removeSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeSkill.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload; // Set the updated skills array
      })
      .addCase(removeSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove skill";
      });
  },
});

export default skillsSlice.reducer;
