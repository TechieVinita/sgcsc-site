// public-site/src/api/api.js
import axios from 'axios';

/* ========== Configuration ========== */
// In production (Vercel), set REACT_APP_API_URL=https://sgcsc-backend.onrender.com/api
// In local dev, your .env can override to http://localhost:5000/api
const baseURL =
  process.env.REACT_APP_API_URL || 'https://sgcsc-backend.onrender.com/api';

const API = axios.create({
  baseURL,
  timeout: 15000,
});

/* ========== Helpers ========== */
const extractData = (res) => {
  if (!res) return null;
  return res.data?.data ?? res.data ?? res;
};

/* attach token automatically (for logged-in students/franchise etc.) */
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore localStorage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* normalize responses and errors */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const serverData = error?.response?.data;

    const message =
      serverData?.message ||
      serverData?.error ||
      error?.message ||
      'Request failed. Please try again.';

    const enriched = { ...error, userMessage: message, status, serverData };

    if (status === 401) {
      // token invalid/expired – clear and let UI handle redirect
      try {
        localStorage.removeItem('token');
      } catch {}
    }

    return Promise.reject(enriched);
  }
);

// Convenience: unwrap to canonical data
API.unwrap = async (promise) => {
  const res = await promise;
  return extractData(res);
};

// Optional helper to manage token (tests or manual)
API.setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  } catch {}
};

/* ========== Domain helpers (public site) ========== */
export const getCourses = () =>
  API.get('/courses').then((r) => extractData(r));

export const getGallery = () =>
  API.get('/gallery').then((r) => extractData(r));

export const sendContact = (data) =>
  API.post('/contact', data).then((r) => extractData(r));

// If you have more APIs (login, result verification etc.), follow same style:
// export const studentLogin = (data) => API.post('/students/login', data).then(extractData);
// export const verifyResult = (payload) => API.post('/results/verify', payload).then(extractData);

export default API;
