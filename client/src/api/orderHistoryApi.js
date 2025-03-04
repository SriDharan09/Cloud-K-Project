import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/orderHistory";

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

export const getOrderHistory = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};


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
