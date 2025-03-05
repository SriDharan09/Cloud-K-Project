import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrderHistory } from "../../api/orderHistoryApi";
import { resetStore } from "./resetSlice.js";

const initialState = {
  orders: [],
  status: "idle",
  error: null,
  statusCode: null,
  loading: false,
};

// Fetch order history
export const fetchOrderHistory = createAsyncThunk(
  "orderHistory/fetch",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      console.log("🔍 Redux Auth State:", state.auth); // Debugging Line
      const token = state.auth.token;

      if (!token) {
        console.error("❌ No token found in Redux state!");
        return thunkAPI.rejectWithValue({
          message: "No token provided",
          statusCode: 401,
        });
      }

      console.log("✅ Token Found:", token); // Debugging Line

      const data = await getOrderHistory(token);
      console.log("📡 API Response:", data); // Debugging Line

      if (!data.success) {
        console.error("❌ Order History Fetch Failed:", data);
        return thunkAPI.rejectWithValue({
          message: data.message || "Unknown error",
          statusCode: data.status || 500,
        });
      }

      return data.history;
    } catch (error) {
      console.error("❌ API Call Failed:", error);
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to fetch order history",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
        state.statusCode = 200;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        console.error("❌ Fetch Order History Failed:", action.payload); // Debugging
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch order history";
        state.statusCode = action.payload?.statusCode || 500;
        state.loading = false;
      })
      .addCase(resetStore, () => initialState);
  },
});

export default orderHistorySlice.reducer;
