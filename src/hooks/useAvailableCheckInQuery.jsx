import { useQuery } from '@tanstack/react-query';
import { useLocalAuth } from '../context/LocalAuthProvider';
import fetchAllAdminCheckIn from './services/useAdminService';
const useAvailableCheckInQuery = () => {
  const { userDetails } = useLocalAuth();

  return useQuery({
    queryKey: ['allAdminCheckIn'],
    queryFn: fetchAllAdminCheckIn,
    enabled: !!userDetails,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default useAvailableCheckInQuery;
