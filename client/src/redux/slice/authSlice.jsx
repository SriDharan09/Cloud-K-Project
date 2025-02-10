import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userLogin, userRegister } from "../../api/authApi.js";

const initialState = {
  user: null,
  token: null,
  statusCode: null,
  errorCode: null,
  loading: false,
  error: null,
  preLogin: true,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const userData = await userLogin(credentials);

      if (!userData.user) {
        return userData;
      }

      localStorage.setItem("user", JSON.stringify(userData.user));
      localStorage.setItem("token", userData.token);
      localStorage.setItem("CIFID", userData.user.cifId);
      localStorage.setItem("role", userData.user.roleName);

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Login failed"
      );
    }
  }
);

export const signUpAsync = createAsyncThunk(
  "auth/signup",
  async (credentials, thunkAPI) => {
    try {
      const userData = await userRegister(credentials);
      console.log(userData);

      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.error || "Signup failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.statusCode = null;
      state.errorCode = null;
      state.loading = false;

      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      localStorage.removeItem("CIFID");
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.preLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
