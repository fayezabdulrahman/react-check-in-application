import { Navigate, Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
const ProtectedRoute = ({ role, redirectTo }) => {
  const user = {
    isAuthenticated: true,
    role: 'admin'
  };

  if (!user.isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (user.role !== role) {
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
