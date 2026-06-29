import axios from "axios";
import { API_ENDPOINTS } from "../../config/endpoint";

const API_BASE_URL = API_ENDPOINTS.AUTH;

export const userLogin = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials,
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        title: error.response.data.title || "Error",
        status: error.response.data.status,
        message:
          error.response.data.error ||
          error.response.data.message ||
          "Something went wrong",
        duration: error.response.data.unlocksAt || null,
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
      modifiedCredentials,
    );
    return response.data;
  } catch (error) {
    if (error.response) {
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
export const userVerification = async (details) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/verifyUser`,
      details,
    );
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
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/forgot`, email);
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
  }
};

export const resetPassword = async (details) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/reset`, details);
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
  }
};

export const changePassword = async (details) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/changepassword`,
      details,
    );
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
  }
};
export const userLogout = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/logout`);
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
  }
};
