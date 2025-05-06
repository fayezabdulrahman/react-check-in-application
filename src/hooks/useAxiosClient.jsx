import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

// Module-level cache (shared across all instances)
let cachedToken = null;
let cachedTokenExpiry = null;
let cachedUserSub = null;

const client = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Add interceptors once (singleton pattern)
let interceptorsAdded = false;

const useAxiosClient = () => {
  const { user, isAuthenticated, getAccessTokenSilently, logout } = useAuth0();

  // Initialize interceptors only once
  if (!interceptorsAdded) {
    interceptorsAdded = true;

    // Request interceptor
    client.interceptors.request.use(async (config) => {
      if (!isAuthenticated) return config;

      const now = Date.now() / 1000;
      
      // Use cached token if valid
      if (cachedToken && cachedTokenExpiry && cachedTokenExpiry > now + 60) {
        console.log('Using cached token');
        config.headers.Authorization = `Bearer ${cachedToken}`;
        if (cachedUserSub) {
          config.headers['X-User-Id'] = cachedUserSub;
        }
        return config;
      }

      try {
        const token = await getAccessTokenSilently({
          cacheMode: 'on',
          detailedResponse: true
        }).catch(async (error) => {
          console.error('Error getting access token:', error);
          if (error.error === 'login_required' || error.error === 'invalid_grant') {
            await logout({ returnTo: `${window.location.origin}/logout` });
          }
          throw error;
        });

        // Update cache
        cachedToken = token.access_token;
        cachedTokenExpiry = token.expires_in ? now + token.expires_in : now + 3600;
        cachedUserSub = user?.sub || null;

        config.headers.Authorization = `Bearer ${token.access_token}`;
        if (user?.sub) {
          config.headers['X-User-Id'] = user.sub;
        }
      } catch (error) {
        console.error('Error in request interceptor:', error);
        throw error;
      }

      return config;
    }, (error) => Promise.reject(error));

    // Response interceptor
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const token = await getAccessTokenSilently({
              cacheMode: 'off',
              detailedResponse: true
            });

            // Update cache
            const now = Date.now() / 1000;
            cachedToken = token.access_token;
            cachedTokenExpiry = token.expires_in ? now + token.expires_in : now + 3600;

            originalRequest.headers.Authorization = `Bearer ${token.access_token}`;
            return client(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            if (refreshError.error === 'login_required' || refreshError.error === 'invalid_grant') {
              await logout({ returnTo: `${window.location.origin}/logout` });
            }
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  return client;
};

export default useAxiosClient;
