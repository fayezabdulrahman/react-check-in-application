import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth0();

  const userRoles = user?.['https://ez-check-in/roles'];

  if (
    !isAuthenticated ||
    !userRoles.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
