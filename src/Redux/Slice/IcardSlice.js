import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "./Http";

const url = process.env.REACT_APP_API + "/student";

export const fetchAllIcards = createAsyncThunk(
  "Icard/all",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${url}/${data}`);
      return res.data.find;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchByClassSectionSchoolAllIcards = createAsyncThunk(
  "Icard/all",
  async (data, { rejectWithValue }) => {
    try {
      // class section school
      const res = await axios.get(
        `${url}/${data.classs}/${data.section}/${data.school}`
      );
      return res.data.find;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const createIcard = createAsyncThunk(
  "Icard/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}`, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateIcard = createAsyncThunk(
  "Icard/update",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${url} `, data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteIcard = createAsyncThunk(
  "Icard/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${url}/${id}/${localStorage.getItem("school")}`);
      return id;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const insertManyIcards = createAsyncThunk(
  "icard/insertMany",
  async (dataArray, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/many`, dataArray);

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const updateManyIcards = createAsyncThunk(
  "icard/updateMany",
  async (dataArray, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${url}/manyupdate`, dataArray);

      return res.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const ICard = createSlice({
  name: "Icard",
  initialState: {
    ICards: [],
    error: null,
    loading: false,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllIcards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(fetchAllIcards.fulfilled, (state, action) => {
        state.ICards = action.payload;
        state.error = null;
        state.message = null;
        state.loading = false;
      })
      .addCase(fetchAllIcards.rejected, (state, action) => {
        state.ICards = [];
        state.loading = false;
        state.error = action.payload.error;
        state.message = null;
      })
      .addCase(createIcard.pending, (state) => {
        state.loading = false;
        state.message = null;
        state.error = null;
      })
      .addCase(createIcard.fulfilled, (state, action) => {
        state.error = null;
        state.ICards.push(action.payload.data);
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(createIcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.message = null;
      })
      .addCase(updateIcard.pending, (state) => {
        state.loading = false;
        state.message = null;
        state.error = null;
      })
      .addCase(updateIcard.fulfilled, (state, action) => {
        const index = state.ICards.findIndex(
          (icard) => icard._id === action.payload.data._id
        );
        if (index !== -1) {
          state.ICards[index] = action.payload.data;
        }
        state.error = null;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateIcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.message = null;
      })
      .addCase(updateManyIcards.pending, (state) => {
        state.loading = false;

        state.message = null;
        state.error = null;
      })
      .addCase(updateManyIcards.fulfilled, (state, action) => {
        for (let index = 0; index < action.payload.data.length; index++) {
          state.ICards.push(action.payload.data[index]);
        }
        state.error = null;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(updateManyIcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(deleteIcard.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.error = null;
      })
      .addCase(deleteIcard.fulfilled, (state, action) => {
        // Remove the deleted Icard from state
        state.ICards = state.ICards.filter(
          (icard) => icard._id !== action.payload
        );
        state.error = null;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(deleteIcard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      .addCase(insertManyIcards.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(insertManyIcards.fulfilled, (state, action) => {
        for (let index = 0; index < action.payload.data.length; index++) {
          state.ICards.push(...action.payload.data[index]);
        }
        state.error = null;
        state.message = action.payload.message;
        state.loading = false;
      })
      .addCase(insertManyIcards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
        state.message = null;
      });
  },
});

// Export actions and reducer
export default ICard.reducer;
