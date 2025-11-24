// public-site/src/api/api.js
import axios from 'axios';

/**
 * API client for public-site
 *
 * Usage:
 *  - import API (axios instance) for custom requests
 *  - or use helpers: getCourses(), getGallery(), sendContact(data)
 *
 * The client will:
 *  - automatically attach `Authorization: Bearer <token>` when token exists in localStorage
 *  - normalize response payloads that use { success, data } or plain data
 *  - normalize errors and provide `err.userMessage`
 */

/* ========== Configuration ========== */
// env var precedence: Next.js / CRA / fallback local
const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.REACT_APP_API_URL ||
  'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  timeout: 15000,
});

/* ========== Helpers ========== */
/**
 * Return the canonical data payload from many API response shapes:
 *  - { success: true, data: ... }
 *  - { data: ... }
 *  - raw payload
 */
const extractData = (res) => {
  if (!res) return null;
  // prefer res.data.data -> res.data -> res
  return res.data?.data ?? res.data ?? res;
};

/* attach token automatically */
API.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      // ignore localStorage errors in some environments
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* normalize responses and errors */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Build a friendly error object for UI
    const status = error?.response?.status;
    const serverData = error?.response?.data;
    const message =
      serverData?.message ||
      serverData?.error ||
      error?.message ||
      'Request failed. Please try again.';

    // Add a user-friendly property and keep original error
    const enriched = { ...error, userMessage: message, status, serverData };

    // Optional: centralized handling (e.g., token expiry)
    if (status === 401) {
      // token expired / unauthorized — clear token to force re-login
      try { localStorage.removeItem('token'); } catch (e) {}
      // note: do not forcibly redirect here, let caller react (or app-level handler)
    }

    return Promise.reject(enriched);
  }
);

/* Convenience: unwrap a promise to return canonical data */
API.unwrap = async (promise) => {
  const res = await promise;
  return extractData(res);
};

/* Convenience: let tests or scripts set/remove token without touching localStorage directly */
API.setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
};

/* ========== Domain helpers (public-site) ========== */
export const getCourses = () => API.get('/courses').then((r) => extractData(r));
export const getGallery = () => API.get('/gallery').then((r) => extractData(r));
export const sendContact = (data) => API.post('/contact', data).then((r) => extractData(r));

/* default export: axios instance with helpers attached */
export default API;
