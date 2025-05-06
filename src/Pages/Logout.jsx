import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/shared/Loading';
import { useLocalAuth } from '../context/LocalAuthProvider';

const Logout = () => {
  const navigate = useNavigate();
  const { setUserDetails } = useLocalAuth();

  useEffect(() => {
    // Run cleanup logic
    localStorage.clear();
    setUserDetails(null);

    navigate('/', { replace: true });
  }, [setUserDetails, navigate]);

  return <Loading />;
};

export default Logout;
