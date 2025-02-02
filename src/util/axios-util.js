import axios from 'axios';

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;
console.log('api url ', apiUrl);

export const client = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

