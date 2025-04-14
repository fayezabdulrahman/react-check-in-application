import { useQuery } from '@tanstack/react-query';
import useUserService from '../hooks/services/useUserService';
import useCheckInStore from '../store/checkin-store';
const usePublishedCheckInQuery = () => {
  const { fetchPublishedCheckin } = useUserService();
  const publishedCheckIn = useCheckInStore((state) => state.publishedCheckIn);

  return useQuery({
    queryKey: ['publishedCheckin'],
    queryFn: fetchPublishedCheckin,
    // enabled: !!publishedCheckIn,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInQuery;
