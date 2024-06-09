import { Navigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useAuth } from '../context/AuthProvider';
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  console.log('token in protected route', token);
  if (token === null) {
    return <Navigate to="/register" />;
  }

  return (
    <>
      <Navigation />
      {children}
    </>
  );
};

export default ProtectedRoute;
