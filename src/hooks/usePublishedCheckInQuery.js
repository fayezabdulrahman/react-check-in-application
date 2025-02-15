import { useQuery } from '@tanstack/react-query';
import { fetchPublishedCheckin } from '../services/userService';
const usePublishedCheckInQuery = () => {
  return useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInQuery;
