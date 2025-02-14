import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import branchReducer from "./slice/branchSlice";
import categoryReducer from "./slice/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    category: categoryReducer,
  },
});

export default store;
