// orderApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orders";

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

// Fetch all orders
export const getOrders = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Fetch order by ID
export const getOrderById = async (id, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Create a new order
export const createOrder = async (orderData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.post("/", orderData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Update order status
export const updateOrderStatus = async (id, statusData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.put(`/${id}/status`, statusData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Delete an order
export const deleteOrder = async (id, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Handle API errors
const handleError = (error) => {
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data.error || "Something went wrong",
    };
  }
  return { success: false, message: "Network error. Please try again later." };
};

