import { getCategories } from "../../api/categoryApi";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  statusCode: null,
  loading: false,
  error: null,
  categories: [],
};

export const fetchCategoryDetails = createAsyncThunk(
  "category/getCategories",
  async (req, thunkApi) => {
    try {
      const response = await getCategories();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.error || "Category Fetch failed"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategoryDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    }),
      builder.addCase(fetchCategoryDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.categories = action.payload;
      }),
      builder.addCase(fetchCategoryDetails.rejected, (state, action) => {
        state.loading = false;
        state.categories = [];
        state.statusCode = action.payload.status;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
