import { Navigate, Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
// import { useAuth } from '../context/AuthProvider';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from '../components/shared/Loading';
import Footer from './Footer';
const ProtectedRoute = ({ allowedRoles }) => {
  // const { token, userState } = useAuth();
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  const userRoles = user?.['https://ez-check-in/roles'];

  console.log('user roles ', userRoles);

  if (
    !isAuthenticated 
    //|| !userRoles.some((role) => allowedRoles.includes(role))
  ) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navigation />
      <Outlet />
      <Footer />
    </>
  );
};

export default ProtectedRoute;
