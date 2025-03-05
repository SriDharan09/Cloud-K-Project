// orderSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  deleteOrder,
} from "../../api/ordersApi";
import { resetStore } from "./resetSlice.js";

const initialState = {
  orders: [],
  order: null,
  status: "idle",
  error: null,
  loading: false,
};

// Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });
      return await getOrders(token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch orders" }
      );
    }
  }
);

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });
      return await getOrderById(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to fetch order" }
      );
    }
  }
);

// Create order
export const createOrderAsync = createAsyncThunk(
  "orders/create",
  async (orderData, thunkAPI) => {
    try {
      console.log(orderData + " created");

      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });
      return await createOrder(orderData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to create order" }
      );
    }
  }
);

// Update order status
export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, statusData }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });
      return await updateOrderStatus(id, statusData, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to update order status" }
      );
    }
  }
);

// Delete order
export const deleteOrderAsync = createAsyncThunk(
  "orders/delete",
  async (id, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });
      return await deleteOrder(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || { message: "Failed to delete order" }
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.order = action.payload.order;
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.orders.push(action.payload.order);
      })
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (o) => o.id === action.payload.order.id
        );
        if (index !== -1) state.orders[index] = action.payload.order;
      })
      .addCase(deleteOrderAsync.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o.id !== action.meta.arg);
      })
      .addCase(resetStore, () => initialState);
  },
});

export default orderSlice.reducer;
