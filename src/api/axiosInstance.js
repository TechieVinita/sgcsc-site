import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL ||
  "https://sgcsc-backend.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// 🔑 Auth token only
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("admin_token") ||
      localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 🚨 IMPORTANT
    // Let browser decide Content-Type for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
