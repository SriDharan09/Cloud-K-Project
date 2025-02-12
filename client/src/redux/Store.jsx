import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import branchReducer from "./slice/branchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
  },
});

export default store;
