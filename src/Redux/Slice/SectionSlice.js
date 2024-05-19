import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/section";

export const AllSection = createAsyncThunk(
  "Section/all",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const AllSectionBySchoolStatus = createAsyncThunk(
  "Section/allBySchoolStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${id}/${true}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const CreateSection = createAsyncThunk(
  "Section/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const UpdateSection = createAsyncThunk(
  "Section/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const SectionSlice = createSlice({
  name: "Section",
  initialState: {
    Sections: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AllSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllSection.fulfilled, (state, action) => {
        state.Sections = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(AllSection.rejected, (state, action) => {
        state.loading = false;
        state.Sections = [];
        state.error = action.payload;
      })
      .addCase(AllSectionBySchoolStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(AllSectionBySchoolStatus.fulfilled, (state, action) => {
        state.Sections = action.payload;
        state.error = null;
        state.loading = false;
      })
      .addCase(AllSectionBySchoolStatus.rejected, (state, action) => {
        state.loading = false;
        state.Sections = [];
        state.error = action.payload;
      })
      .addCase(CreateSection.pending, (state) => {
        state.loading = true;
      })
      .addCase(CreateSection.fulfilled, (state, action) => {
        state.Sections.push(action.payload.data);
        state.error = null;
        state.loading = false;
      })
      .addCase(UpdateSection.pending, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(UpdateSection.fulfilled, (state, action) => {
        state.error = null;
        const index = state.Sections.findIndex(
          (icard) => icard._id === action.payload.data._id
        );
        if (index !== -1) {
          state.Sections[index] = action.payload.data;
        }
        state.loading = false;
      })
      .addCase(UpdateSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default SectionSlice.reducer;
