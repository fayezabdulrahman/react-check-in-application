import { useQuery } from '@tanstack/react-query';
import useUserService from '../hooks/services/useUserService';
import { useAdmin } from '../context/AdminProvider';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocalAuth } from '../context/LocalAuthProvider';
const usePublishedCheckInQuery = () => {
  const { fetchPublishedCheckin } = useUserService();
  const { isAuthenticated } = useAuth0();
  const {userDetails} = useLocalAuth();
  const { setPublishedCheckIn } = useAdmin();

  return useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin,
    onSuccess: (data) => {
      setPublishedCheckIn(data?.checkIn || null);
    },
    enabled: !!userDetails,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInQuery;
