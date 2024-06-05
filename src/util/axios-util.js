import axios from 'axios';

export const client = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

client.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await client.get('/refreshToken');
        return client(originalRequest);
      } catch (error) {
        console.error('Token refresh failed', error);
      }
    }
    return Promise.reject(error);
  }
);
