import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBranchDetails } from "../../api/branchApi";
import { resetStore } from "./resetSlice.js";

const initialState = {
  statusCode: null,
  loading: false,
  error: null,
  branchDetails: [],
};

export const fetchBranchDetails = createAsyncThunk(
  "branch/getBranchDetails",
  async (req, thunkAPI) => {
    try {
      const response = await getBranchDetails(req);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Branch Fetch failed"
      );
    }
  }
);

const branchSlice = createSlice({
  name: "branch",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBranchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBranchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.branchDetails = action.payload;
      })
      .addCase(fetchBranchDetails.rejected, (state, action) => {
        state.loading = false;
        state.branchDetails = [];
        state.statusCode = action.payload.status;
        state.error = action.payload;
      })
      .addCase(resetStore, () => initialState);
  },
});

export default branchSlice.reducer;
