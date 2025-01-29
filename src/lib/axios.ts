import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blogger-backend-phi.vercel.app/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;