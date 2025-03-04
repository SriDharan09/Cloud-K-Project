import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import branchReducer from "./slice/branchSlice";
import categoryReducer from "./slice/categorySlice";
import menuReducer from "./slice/menuSlice";
import profileReducer from "./slice/profileSlice";
import NotificationReducer from "./slice/notificationSlice";
import orderReducer from "./slice/orderSlice";
import cartReducer from "./slice/cartSlice";
import orderHistoryReducer from "./slice/orderHistorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    category: categoryReducer,
    menu: menuReducer,
    profile: profileReducer,
    notification: NotificationReducer,
    order: orderReducer,
    cart: cartReducer,
    orderHistory: orderHistoryReducer,
  },
});

export default store;
