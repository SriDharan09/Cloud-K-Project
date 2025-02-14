import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/categories/";

export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
  } catch (error) {
    if (error?.response) {
      return {
        success: false,
        status: error.response.status,
        title: error.response.data.title || "Error",
        message:
          error.response.data.error ||
          error.response.data.message ||
          "Something went wrong",
      };
    }
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};
