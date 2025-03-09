import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useLayoutEffect } from 'react';

const apiUrl = import.meta.env.VITE_BACKEND_API_URL;

const client = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

const useAxiosClient = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  // Attach Axios interceptor to include the Auth0 token in every request
  useLayoutEffect(() => {
    const requestInterceptor = client.interceptors.request.use(
      async (config) => {
        if (isAuthenticated) {
          try {
            const token = await getAccessTokenSilently();
            config.headers.Authorization = `Bearer ${token}`;

            // Attach user.sub (auth0Id in MongoDB) if available
            if (user?.sub) {
              config.headers['X-User-Id'] = user.sub;
            }
          } catch (error) {
            console.error('Error getting access token:', error);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      client.interceptors.request.eject(requestInterceptor);
    };
  }, [getAccessTokenSilently, isAuthenticated, user]);

  return client; // Return the client instance
};

export default useAxiosClient;
