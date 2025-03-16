import { useQuery } from '@tanstack/react-query';
import useUserService from '../hooks/services/useUserService';
import { useLocalAuth } from '../context/LocalAuthProvider';
const usePublishedCheckInQuery = () => {
  const { fetchPublishedCheckin } = useUserService();
  const { userDetails } = useLocalAuth();

  return useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin,
    enabled: !!userDetails,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInQuery;
