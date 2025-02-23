import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/notifications";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Needed for authentication
});

const setAuthHeader = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// Fetch user notifications
export const getUserNotifications = async (token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.get("/userNotifications");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.put(`/read/${notificationId}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// Delete a notification
export const deleteNotification = async (notificationId, token) => {
  try {
    setAuthHeader(token);
    const response = await axiosInstance.delete(`/${notificationId}`);
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