import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/class";

export const AllClass = createAsyncThunk(
  "Class/all",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const AllClassBySchoolStatus = createAsyncThunk(
  "Class/allSchoolStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}/${true}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// create for admin
export const CreateClass = createAsyncThunk(
  "Class/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
// update for admin
export const UpdateClass = createAsyncThunk(
  "Class/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const ClassSlice = createSlice({
  name: "Class",
  initialState: {
    Classs: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AllClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllClass.fulfilled, (state, action) => {
        state.Classs = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(AllClass.rejected, (state, action) => {
        state.loading = false;
        state.Classs = [];
        state.error = action.payload;
      })
      .addCase(AllClassBySchoolStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllClassBySchoolStatus.fulfilled, (state, action) => {
        state.Classs = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(AllClassBySchoolStatus.rejected, (state, action) => {
        state.loading = false;
        state.Classs = [];
        state.error = action.payload;
      })
      .addCase(CreateClass.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateClass.fulfilled, (state, action) => {
        state.Classs.push(action.payload.data);
        state.error = null;
        state.loading = false;
      })
      .addCase(UpdateClass.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateClass.fulfilled, (state, action) => {
        const index = state.Classs.findIndex(
          (icard) => icard._id === action.payload.data._id
        );
        if (index !== -1) {
          state.Classs[index] = action.payload.data;
        }
        state.error = null;
        state.loading = false;
      })
      .addCase(UpdateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ClassSlice.reducer;
