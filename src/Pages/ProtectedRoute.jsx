import { Navigate, Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthProvider';
const ProtectedRoute = () => {
  const { token } = useAuth();
  const { userState } = useAuth();

  if (token === null || userState.role === undefined ) {
    return <Navigate to="/register" replace />;
  }

  return (
    <>
      <Navigation />
      <Outlet />
    </>
  );
};

export default ProtectedRoute;
