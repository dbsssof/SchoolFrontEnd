import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/teacherauth";

export const loginTeacher = createAsyncThunk(
  "auth/loginTeacher",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}`, credentials);
      if (response.status === 200) {
        localStorage.setItem("schoolid", response.data.schoolid);
        localStorage.setItem("user", response.data.email);
        localStorage.setItem("Ttoken", response.data.token);
        localStorage.setItem("expired", response.data.expired);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const createTeacherLogin = createAsyncThunk(
  "auth/RegisterTeacher",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/register `, data);

      if (response.status === 302) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateTeacherLogin = createAsyncThunk(
  "auth/updateTeacherLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/forget `, data);

      if (response.status === 302) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const findlogger = createAsyncThunk(
  "auth/findloger",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/find/${data}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("Ttoken");
      localStorage.removeItem("schoolid");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginTeacher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTeacher.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginTeacher.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.response?.data?.error;
      });
  },
});

export const { logout, setTeacher } = loginSlice.actions;

export default loginSlice.reducer;
