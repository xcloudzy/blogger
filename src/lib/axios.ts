import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blogger-backend-phi.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;