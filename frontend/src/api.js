import axios from 'axios';

const rawBaseUrl = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: rawBaseUrl.replace(/\/+$/, ''),
});

export default api;
