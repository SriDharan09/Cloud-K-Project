import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { userLogin, userRegister } from "../../api/authApi.js";
import { fetchNotifications } from "./notificationSlice.js";

const initialState = {
  user: null,
  token: null,
  email: "",
  statusCode: null,
  errorCode: null,
  loading: false,
  error: null,
  preLogin: true,
  isAdmin: false,
  isUserLogin: false,
  token: null,
};

export const loginAsync = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const userData = await userLogin(credentials);
      setTimeout(() => {
        thunkAPI.dispatch(fetchNotifications());
      }, 500);
      if (!userData.user) {
        return userData;
      }

      // localStorage.setItem("user", JSON.stringify(userData.user));
      // localStorage.setItem("token", userData.token);
      // localStorage.setItem("CIFID", userData.user.cifId);
      // localStorage.setItem("role", userData.user.roleName);

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
      console.log(credentials.email);

      return { ...userData, email: credentials.email };
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
      state.email = "";
      state.error = null;
      state.preLogin = true;
      state.isAdmin = false;
      state.token = null;
      state.isUserLogin = false;

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
    setUpdateUser: (state, action) => {
      console.log(action.payload);
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    setUserEmail: (state, action) => {
      state.email = action.payload.email;
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
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isUserLogin = true;
        state.token = action.payload.token;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.error = action.payload || "Login failed";
      })
      .addCase(signUpAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpAsync.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.email = action.payload.email;
        state.statusCode = action.payload.status;
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.loading = false;
        state.statusCode = action.payload.status;
        state.error = action.payload || "Signup failed";
      });
  },
});

export const { logout, setUser, setUserEmail, setUpdateUser } =
  authSlice.actions;
export default authSlice.reducer;
