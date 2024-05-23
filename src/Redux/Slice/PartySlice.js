import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/partyauth";

export const loginParty = createAsyncThunk(
  "auth/loginParty",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/login`, credentials);
      if (response.status === 200) {
        localStorage.setItem("schoolid", response.data.schoolid);
        localStorage.setItem("user", response.data.email);
        localStorage.setItem("partyToken", response.data.partyToken);
        localStorage.setItem("expired", response.data.expired);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const createPartyLogin = createAsyncThunk(
  "auth/RegisterParty",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/register `, data);

      if (response.status === 302) {
        return rejectWithValue(response.data);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const updatePartyLogin = createAsyncThunk(
  "auth/updatePartyLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/forget `, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
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
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginpartySlice = createSlice({
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
      localStorage.removeItem("schoolid");
      localStorage.removeItem("partyToken");
      localStorage.removeItem("schoolName");
      localStorage.removeItem("expiredStatus");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginParty.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(loginParty.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload.error;
      });
  },
});

export const { logout } = loginpartySlice.actions;

export default loginpartySlice.reducer;
