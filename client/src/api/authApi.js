import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const userLogin = async (credentials) => {
  try {
    console.log(credentials);
    const response = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    return response.data;
  } catch (e) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};
