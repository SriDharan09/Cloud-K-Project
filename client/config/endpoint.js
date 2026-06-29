const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
// const BASE_URL =
//   import.meta.env.VITE_API_URL ||
//   "https://whiny-abdomen-flagstick.ngrok-free.dev";

export const API_BASE_URL = `${BASE_URL}/api`;

export const API_ENDPOINTS = {
  AUTH: `${API_BASE_URL}`,
  BRANCH: `${API_BASE_URL}/branch/`,
  CART: `${API_BASE_URL}/carts/`,
  CATEGORIES: `${API_BASE_URL}/categories`,
  MENU: `${API_BASE_URL}/menu/`,
  NOTIFICATION: `${API_BASE_URL}/notifications/`,
  ORDER_HISTORY: `${API_BASE_URL}/orderHistory/`,
  ORDERS: `${API_BASE_URL}/orders/`,
  PROFILE: `${API_BASE_URL}/profile/`,
  SOCKET: `${BASE_URL}/`,
};
