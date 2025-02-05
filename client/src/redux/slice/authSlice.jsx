import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userLogin } from "../../api/authApi.js";

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (credentials, { rejectWithValue }) => {
    try {
      const userData = await userLogin(credentials);
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  role: null,
  CIFID: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state, action) => {
      (state.user = null),
        (state.role = null),
        (state.CIFID = null),
        (state.isAuthenticated = false);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginAsync.pending, (state, action) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.CIFID = action.payload.CIFID;
      state.isAuthenticated = true;
    });
    builder.addCase(loginAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
