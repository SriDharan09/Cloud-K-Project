import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/profile";

// Create an axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Needed for cookies-based auth
});

// Function to set Authorization Header (when calling API)
const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Fetch user profile
export const getUserProfile = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.put("/", profileData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Change password
export const changeUserPassword = async (passwordData, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.put("/change-password", passwordData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Upload profile image
export const uploadProfileImage = async (file, token) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    setAuthHeader(token);
    const response = await axiosInstance.post("/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
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
