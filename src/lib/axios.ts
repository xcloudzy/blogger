import axios from 'axios';

const api = axios.create({
  baseURL: 'https://blogger-backend-phi.vercel.app/api',
});

export default api;