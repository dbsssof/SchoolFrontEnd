import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

// eslint-disable-next-line no-undef
const url = process.env.REACT_APP_API + "/teacher";

// Teacher and teacher
export const getAllTeacherBySchool = createAsyncThunk(
  "Teacher/BySchoolall",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/byschool/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// teacher portal
export const getByIdTeacher = createAsyncThunk(
  "Teacher/BySchoolall",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
      localStorage.setItem("schoolid", res.data.schoolid);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// admin / teacher / Teacher
export const createTeacher = createAsyncThunk(
  "Teacher/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(url, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data?.error);
    }
  }
);
// admin / teacher / Teacher
export const updateTeacher = createAsyncThunk(
  "Teacher/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}/${data._id}/${data.schoolid}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const Teacher = createSlice({
  name: "Teacher",
  initialState: {
    Teacher: [],
    error: null,
    loading: false,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTeacherBySchool.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTeacherBySchool.fulfilled, (state, action) => {
        state.Teacher = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(getAllTeacherBySchool.rejected, (state, action) => {
        state.loading = false;
        state.Teacher = [];
        state.error = action.payload;
      })
      .addCase(createTeacher.pending, (state) => {
        state.loading = false;
      })
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.message = action.payload?.message;
        state.Teacher.push(action.payload?.data);
      })
      .addCase(createTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTeacher.pending, (state) => {
        state.loading = false;
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.Teacher.findIndex(
          (Teacher) => Teacher._id === action.payload.data._id
        );
        if (index !== -1) {
          state.Teacher[index] = action.payload.data;
        }
        state.error = null;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateTeacher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default Teacher.reducer;
