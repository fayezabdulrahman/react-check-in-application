import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState
} from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useMutation } from '@tanstack/react-query';
import useAuthService from '../hooks/services/useAuthService';

import Loading from '../components/shared/Loading.jsx';

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
