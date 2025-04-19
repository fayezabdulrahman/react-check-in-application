import { useQuery } from '@tanstack/react-query';
import useUserService from '../hooks/services/useUserService';
const usePublishedCheckInQuery = () => {
  const { fetchPublishedCheckin } = useUserService();

  return useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInQuery;
