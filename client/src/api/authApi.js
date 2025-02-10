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
        title: error.response.data.title || "Error",
        status: error.response.data.status,
        message: error.response.data.error || error.response.data.message ||  "Something went wrong",
        duration : error.response.data.unlocksAt || null
      };
    }

    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};

export const userRegister = async (credentials) => {
  try {
    const modifiedCredentials = {
      username: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
      RoleId: 1,
    };
    console.log(modifiedCredentials);

    const response = await axios.post(
      `${API_BASE_URL}/auth/register`,
      modifiedCredentials
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        title:  error.response.data.title || "Error",
        message: error.response.data.error || error.response.data.message ||  "Something went wrong",
      };
    }

    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
};
