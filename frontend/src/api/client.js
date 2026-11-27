import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('carenest_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('carenest_token');
      localStorage.removeItem('carenest_user');
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (err) => {
  if (err.response?.data?.details) {
    return Object.values(err.response.data.details).join(', ');
  }
  return err.response?.data?.error || err.message || 'Something went wrong. Please try again.';
};

export default api;
