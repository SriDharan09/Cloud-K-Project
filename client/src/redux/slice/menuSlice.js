import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMenus } from "../../api/menuApi";

const initialState = {
  statusCode: null,
  loading: false,
  error: null,
  menuDetails: [],
};
export const fetchMenuDetails = createAsyncThunk(
  "menu/getMenuDetails",
  async (req, thunkApi) => {
    try {
      const response = await getMenus();
      return response;
    } catch (error) {
      return thunkApi.rejectWithValue(
        error.response?.data?.error || "Menu Fetch failed"
      );
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.menuDetails = action.payload;
      })
      .addCase(fetchMenuDetails.rejected, (state, action) => {
        state.loading = false;
        state.menuDetails = [];
        state.statusCode = action.payload.status;
        state.error = action.payload;
      });
  },
});

export default menuSlice.reducer;
