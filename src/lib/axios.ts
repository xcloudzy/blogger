import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blogger-backend-phi.vercel.app',
  withCredentials: true,
});

export default api;