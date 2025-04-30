import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import useAuthService from '../hooks/services/useAuthService';

import Loading from '../components/shared/Loading.jsx';
import usePushNotifications from '../hooks/useNotification.jsx';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLocalAuth = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('useAuth must be used within an LocalAuthProvider');
  }
  return authContext;
};

const LocalAuthProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const { fetchUser, registerUser } = useAuthService();

  const hasSubscribed = useRef(false); // Track if we've already attempted subscription
  const { notificationPermission, requestPermissionAndSubscribe } =
    usePushNotifications();

  // Ensure app only renders after Auth0 is initialized
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userDetails !== null)) {
      setLoading(false);
    }
  }, [isLoading, isAuthenticated, userDetails]);

  const { mutate: fetchUserMutate } = useMutation({
    mutationFn: fetchUser,
    onSuccess: (response) => {
      setUserDetails(response);
    },
    onError: (error) => {
      console.error('Error Finding User', error);
      // If user is not found, register the user
      if (error.response?.status === 404 && user) {
        const userRoles = user?.['https://ez-check-in/roles'];
        const userToRegister = {
          email: user.email,
          username: user.nickname,
          auth0Id: user.sub,
          roles: userRoles
        };
        registerUserMutate(userToRegister);
      }
    }
  });

  const { mutate: registerUserMutate } = useMutation({
    mutationFn: registerUser, // Calls API only when triggered
    onSuccess: (response) => {
      // set the userDetails state from the returned MongoDB user
      setUserDetails(response.user);
    },
    onError: (error) => {
      console.error('Error Registering user', error);
    }
  });

  // Handle push notification subscription
  const handlePushSubscription = async (userId) => {
    // Don't attempt if already subscribed or no user ID
    if (hasSubscribed.current || !userId) return;

    // Don't attempt if permission was previously denied
    if (notificationPermission === 'denied') {
      console.log('Notifications were previously denied by user');
      return;
    }

    try {
      hasSubscribed.current = true;

      // Only attempt subscription if permission is granted or can be requested
      if (
        notificationPermission === 'granted' ||
        notificationPermission === 'default'
      ) {
        await requestPermissionAndSubscribe();
      }
    } catch (error) {
      console.error('Push notification subscription error:', error);
      hasSubscribed.current = false; // Reset on error to allow retry
    }
  };

  // Fetch or register user in db
  useLayoutEffect(() => {
    if (isAuthenticated && user && !userDetails) {
      const userRoles = user?.['https://ez-check-in/roles'];
      const payload = {
        auth0Id: user.sub,
        roles: userRoles
      };
      fetchUserMutate(payload);
    }
  }, [isAuthenticated, user, userDetails, fetchUserMutate]);

  useLayoutEffect(() => {
    // When we have userDetails - ask the user for push notifications
    if (userDetails?._id) {
      handlePushSubscription(userDetails._id);
    }
  }, [userDetails, notificationPermission]);

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
    localStorage.clear();
  };

  const ctxValue = {
    user,
    isAuthenticated,
    loading,
    handleAppLogout: handleLogout,
    userDetails,
    setUserDetails
  };

  return (
    <AuthContext.Provider value={ctxValue}>
      {loading ? <Loading /> : children}
    </AuthContext.Provider>
  );
};

export default LocalAuthProvider;
