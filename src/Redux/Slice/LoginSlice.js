import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/teacherauth";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);
      if (response.status === 404) {
        return rejectWithValue(response?.data);
      }
      if (response.status === 200) {
        localStorage.setItem("user", response.data.email);
        localStorage.setItem("Ttoken", response.data.token);
        localStorage.setItem("teach", response.data.teach);

        return response.data;
      }
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
  },
  reducers: {
    logout: (state) => {
      state.error = null;
      state.user = null;

      localStorage.removeItem("user");
      localStorage.removeItem("Ttoken");
      localStorage.removeItem("teach");
      localStorage.removeItem("schoolid");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.response?.data?.error;
      });
  },
});

export const { logout, setUser } = loginSlice.actions;

export default loginSlice.reducer;
