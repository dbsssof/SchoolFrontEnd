import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/adminauth";

export const loginUser = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);
      if (response.status === 200) {
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("Admintoken", response.data.adminToken);
        localStorage.setItem("schoolid", response.data.schoolid);
        localStorage.setItem("expired", response.data.expired || "");
        return response.data;
      }
      return rejectWithValue(response.data);
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const loginSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("email");
      localStorage.removeItem("Admintoken");
      localStorage.removeItem("schoolid");
      localStorage.removeItem("schoolName");
      localStorage.removeItem("expired");
      localStorage.removeItem("expiredStatus");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = loginSlice.actions;

export default loginSlice.reducer;
