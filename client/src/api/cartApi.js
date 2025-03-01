import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/cart";
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Fetch cart
export const fetchCart = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch cart" };
  }
};

// Add item to cart
export const addItemToCart = async (cartData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.post("/add", cartData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to add item" };
  }
};

// Update item quantity
export const updateCartItem = async (cartData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.put("/update", cartData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to update item" };
  }
};

// Remove item from cart
export const removeCartItem = async (cartData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.delete("/remove", { data: cartData });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to remove item" };
  }
};

// Clear cart
export const clearCart = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.delete("/clear");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to clear cart" };
  }
};
