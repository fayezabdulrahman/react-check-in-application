import { Navigate, Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { UserContext } from '../hooks/auth';
import { useContext } from 'react';
const ProtectedRoute = ({ role, redirectTo }) => {
  const {cookie, user} = useContext(UserContext);
  // const user = {
  //   isAuthenticated: true,
  //   role: 'user'
  // };

  // if (!user.isAuthenticated) {
  //   return <Navigate to="/" />;
  // }

  if (!cookie.token) {
    return <Navigate to="/" />;
  }

  if (user.role !== 'user') {
    console.log('role', role);
    console.log('redirectTo', redirectTo);
    return <Navigate to={redirectTo} />;
  }

  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
