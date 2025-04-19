import { useQuery } from '@tanstack/react-query';
import useAdminService from '../hooks/services/useAdminService';
import useCheckInStore from '../store/checkin-store';
const usePublishedCheckInAnalytics = () => {
  const { fetchPublishedCheckInAnalytics } = useAdminService();
  const publishedCheckIn = useCheckInStore((state) => state.publishedCheckIn);
  return useQuery({
    queryKey: ['publishedCheckinAnalytics'],
    queryFn: () => {
      return fetchPublishedCheckInAnalytics(publishedCheckIn.checkInId);
    },
    enabled: publishedCheckIn !== null,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInAnalytics;
