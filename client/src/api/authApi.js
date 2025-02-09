import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const userLogin = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.error || "Something went wrong",
      };
    }

    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};
