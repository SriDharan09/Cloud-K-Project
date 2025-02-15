import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import branchReducer from "./slice/branchSlice";
import categoryReducer from "./slice/categorySlice";
import menuReducer from "./slice/menuSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    category: categoryReducer,
    menu: menuReducer,
  },
});

export default store;
