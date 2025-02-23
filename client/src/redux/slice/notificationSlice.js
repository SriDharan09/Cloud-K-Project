import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api/notificationApi";

const initialState = {
  notifications: [],
  status: "idle",
  error: null,
  loading: false,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      if (!token)
        return thunkAPI.rejectWithValue({
          message: "Authentication token missing",
        });

      return await getUserNotifications(token);
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to fetch notifications",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

export const markAsReadAsync = createAsyncThunk(
  "notifications/markRead",
  async (notificationId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      return await markNotificationAsRead(notificationId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to mark notification as read"
      );
    }
  }
);

export const deleteNotificationAsync = createAsyncThunk(
  "notifications/delete",
  async (notificationId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      return await deleteNotification(notificationId, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.message || "Failed to delete notification"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.notifications = action.payload.notifications;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload?.message || "Failed to fetch notifications";
        state.loading = false;
      })
      .addCase(markAsReadAsync.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((notification) =>
          notification.id === action.meta.arg
            ? { ...notification, is_read: true }
            : notification
        );
      })
      .addCase(deleteNotificationAsync.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(
          (notification) => notification.id !== action.meta.arg
        );
      });
  },
});

export default notificationSlice.reducer;
    