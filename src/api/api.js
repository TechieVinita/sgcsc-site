import axios from "axios";

const baseURL =
  process.env.REACT_APP_API_URL ||
  "https://sgcsc-backend.onrender.com/api";

const API = axios.create({
  baseURL,
  timeout: 15000,
});

/* normalize errors */
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg =
      err?.response?.data?.message ||
      err.message ||
      "Request failed";
    return Promise.reject({ ...err, userMessage: msg });
  }
);

/* ===== PUBLIC EXPORTS ===== */

export const getCourses = async () => {
  const res = await API.get("/courses");
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

/* ===== SETTINGS ===== */

export const getSettings = async () => {
  const res = await API.get("/settings");
  return res.data?.data || null;
};

/* ===== CREDITS (Franchise) ===== */

export const getMyCredits = async () => {
  const res = await API.get("/credits/my-credits");
  return res.data?.data || null;
};

export const getMyTransactions = async (limit = 10) => {
  const res = await API.get(`/credits/my-transactions?limit=${limit}`);
  return res.data?.data?.transactions || [];
};

export const getTopupInfo = async () => {
  const res = await API.get("/credits/topup-info");
  return res.data?.data || null;
};

export const getCreditPricing = async () => {
  const res = await API.get("/credits/pricing");
  return res.data?.data || null;
};

/* ===== FRANCHISE PROFILE ===== */

export const getFranchiseProfile = async () => {
  const res = await API.get("/franchise-profile/me");
  return res.data?.data || null;
};

export const getFranchiseStats = async () => {
  const res = await API.get("/franchise-profile/stats");
  return res.data?.data || null;
};

export default API;
