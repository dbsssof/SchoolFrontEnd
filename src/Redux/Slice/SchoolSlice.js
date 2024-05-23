import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

// eslint-disable-next-line no-undef
const url = process.env.REACT_APP_API + "/school";
// Admin
export const getAllSchool = createAsyncThunk(
  "School/all",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// get school by id
export const getByUserAllSchool = createAsyncThunk(
  "School/ByIdSchool",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${url}/${id}`
      );
      localStorage.setItem("schoolName", res.data.name);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// admin / teacher / school
export const createSchool = createAsyncThunk(
  "School/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(url, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// admin / teacher / school
export const updateSchool = createAsyncThunk(
  "School/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}/${data._id}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const School = createSlice({
  name: "School",
  initialState: {
    School: [],
    error: null,
    loading: false,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSchool.fulfilled, (state, action) => {
        state.School = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAllSchool.rejected, (state, action) => {
        state.loading = false;
        state.School = [];
        state.error = action.payload.error;
      })
      .addCase(getByUserAllSchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(getByUserAllSchool.fulfilled, (state, action) => {
        state.School = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getByUserAllSchool.rejected, (state, action) => {
        state.loading = false;
        state.School = [];
        state.error = action.payload.error;
      })
      .addCase(createSchool.pending, (state) => {
        state.loading = false;
      })
      .addCase(createSchool.fulfilled, (state, action) => {
        state.error = null;
        state.School.push(action.payload.data);
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSchool.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateSchool.fulfilled, (state, action) => {
        const index = state.School.findIndex(
          (School) => School._id === action.payload.data._id
        );
        if (index !== -1) {
          state.School[index] = action.payload.data;
        }
        state.error = null;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export default School.reducer;
