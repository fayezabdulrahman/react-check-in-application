import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

