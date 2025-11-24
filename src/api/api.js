// public-site/src/api/api.js
import axios from 'axios';

const baseURL =
  process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL,
  timeout: 15000,
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    // let caller handle errors; normalize message
    const message = err?.response?.data?.message || err?.message || 'Request failed';
    return Promise.reject({ ...err, userMessage: message });
  }
);

export const getCourses = () => API.get('/courses').then((r) => r.data?.data ?? r.data);
export const getGallery = () => API.get('/gallery').then((r) => r.data?.data ?? r.data);
export const sendContact = (data) => API.post('/contact', data).then((r) => r.data?.data ?? r.data);

export default API;
