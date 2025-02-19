import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/profile";

// Function to get the token from localStorage
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Needed for cookies-based auth
});

// 🔹 Add Authorization Header for JWT (if needed)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ Ensure token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fetch user profile
export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get("/");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const response = await axiosInstance.put("/", profileData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Change password
export const changeUserPassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put("/change-password", passwordData);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Upload profile image
export const uploadProfileImage = async (file) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
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
