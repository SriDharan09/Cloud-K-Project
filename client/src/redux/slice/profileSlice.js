import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  uploadProfileImage,
} from "../../api/profileApi"; // Importing API functions

const initialState = {
  user: null,
  status: "idle",
  error: null,
  statusCode: null,
  loading: false,
};

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  "profile/fetch",
  async (_, thunkAPI) => {
    try {
      const data = await getUserProfile();
      console.log(data);

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to fetch profile",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Update user profile
export const updateProfileAsync = createAsyncThunk(
  "profile/update",
  async (profileData, thunkAPI) => {
    try {
      const data = await updateUserProfile(profileData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to update profile",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Change password
export const changePasswordAsync = createAsyncThunk(
  "profile/changePassword",
  async (passwordData, thunkAPI) => {
    try {
      console.log( JSON.stringify(passwordData, null, 2) + "Inside profile slice");
      
      const data = await changeUserPassword(passwordData);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to change password",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Upload profile image
export const uploadProfileImageAsync = createAsyncThunk(
  "profile/uploadImage",
  async (file, thunkAPI) => {
    try {
      const data = await uploadProfileImage(file);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue({
        message: error.message || "Failed to upload image",
        statusCode: error.response?.status || 500,
      });
    }
  }
);

// Profile slice
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.user;
        state.statusCode = action.payload.status || 200;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.statusCode = action.payload.status;
        state.loading = false;
      })

      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, ...action.payload.user };
        state.statusCode = action.payload.status || 200;
        state.loading = false;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.statusCode = action.payload.status;
        state.loading = false;
      })

      // Change Password
      .addCase(changePasswordAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(changePasswordAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statusCode = action.payload.status || 200;
        state.loading = false;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.statusCode = action.payload.status;
        state.loading = false;
      })

      // Upload Profile Image
      .addCase(uploadProfileImageAsync.pending, (state) => {
        state.status = "loading";
        state.loading = true;
      })
      .addCase(uploadProfileImageAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = { ...state.user, profileImage: action.payload.imageUrl };
        state.statusCode = action.payload.status || 200;
        state.loading = false;
      })
      .addCase(uploadProfileImageAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
        state.statusCode = action.payload.status;
        state.loading = false;
      });
  },
});

export default profileSlice.reducer;
