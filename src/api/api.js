import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // your backend
  timeout: 10000,
});

export const getCourses = () => API.get('/courses');
export const getGallery = () => API.get('/gallery');
export const sendContact = (data) => API.post('/contact', data);

export default API;
