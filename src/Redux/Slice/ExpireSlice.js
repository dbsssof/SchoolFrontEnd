import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = process.env.REACT_APP_API + "/verifyexpire";

export const verifyExpire = createAsyncThunk(
  "auth/verifyexpire",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${url}/${localStorage.getItem("expired")}`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      if (error.response.status === 400) {
        localStorage.setItem("expiredStatus", true);
      } else {
        localStorage.setItem("expiredStatus", false);
      }

      return rejectWithValue(error.response.data.error);
    }
  }
);

export const verifyExpireSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {},
});

export default verifyExpireSlice.reducer;
