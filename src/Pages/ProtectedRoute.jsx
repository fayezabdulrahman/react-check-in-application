import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../components/shared/Loading';
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  // const userRoles = user?.['https://ez-check-in/roles'];


  if (
    !isAuthenticated
    //|| !userRoles.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
