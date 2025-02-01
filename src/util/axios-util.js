import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:9000/api',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

