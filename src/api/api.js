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

export const getCertificateTemplateConfig = async () => {
  const res = await API.get("/settings/certificate-template");
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

/* ===== FRANCHISE COURSES ===== */

export const getFranchiseCourses = async () => {
  const res = await API.get("/franchise/courses");
  return Array.isArray(res.data) ? res.data : [];
};

export const getFranchiseCourse = async (id) => {
  const res = await API.get(`/franchise/courses/${id}`);
  return res.data || null;
};

export const createFranchiseCourse = async (courseData) => {
  const res = await API.post("/franchise/courses", courseData);
  return res.data;
};

export const updateFranchiseCourse = async (id, courseData) => {
  const res = await API.put(`/franchise/courses/${id}`, courseData);
  return res.data;
};

export const deleteFranchiseCourse = async (id) => {
  const res = await API.delete(`/franchise/courses/${id}`);
  return res.data;
};

/* ===== FRANCHISE SUBJECTS ===== */

export const getFranchiseSubjects = async () => {
  const res = await API.get("/franchise/subjects");
  return Array.isArray(res.data) ? res.data : [];
};

export const getFranchiseSubject = async (id) => {
  const res = await API.get(`/franchise/subjects/${id}`);
  return res.data || null;
};

export const createFranchiseSubject = async (subjectData) => {
  const res = await API.post("/franchise/subjects", subjectData);
  return res.data;
};

export const updateFranchiseSubject = async (id, subjectData) => {
  const res = await API.put(`/franchise/subjects/${id}`, subjectData);
  return res.data;
};

export const deleteFranchiseSubject = async (id) => {
  const res = await API.delete(`/franchise/subjects/${id}`);
  return res.data;
};

/* ===== FRANCHISE RESULTS ===== */

export const getFranchiseResults = async () => {
  const res = await API.get("/franchise/results");
  return Array.isArray(res.data) ? res.data : [];
};

export const getFranchiseResult = async (id) => {
  const res = await API.get(`/franchise/results/${id}`);
  return res.data || null;
};

export const createFranchiseResult = async (resultData) => {
  const res = await API.post("/franchise/results", resultData);
  return res.data;
};

export const updateFranchiseResult = async (id, resultData) => {
  const res = await API.put(`/franchise/results/${id}`, resultData);
  return res.data;
};

export const deleteFranchiseResult = async (id) => {
  const res = await API.delete(`/franchise/results/${id}`);
  return res.data;
};

/* ===== FRANCHISE CERTIFICATES ===== */

export const getFranchiseCertificates = async () => {
  const res = await API.get("/franchise/certificates");
  return Array.isArray(res.data) ? res.data : [];
};

export const getFranchiseCertificate = async (id) => {
  const res = await API.get(`/franchise/certificates/${id}`);
  return res.data || null;
};

export const createFranchiseCertificate = async (certificateData) => {
  const res = await API.post("/franchise/certificates", certificateData);
  return res.data;
};

export const updateFranchiseCertificate = async (id, certificateData) => {
  const res = await API.put(`/franchise/certificates/${id}`, certificateData);
  return res.data;
};

export const deleteFranchiseCertificate = async (id) => {
  const res = await API.delete(`/franchise/certificates/${id}`);
  return res.data;
};

export default API;
