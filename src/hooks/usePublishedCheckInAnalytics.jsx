import { useQuery } from '@tanstack/react-query';
import useAdminService from '../hooks/services/useAdminService';
import { useAdmin } from '../context/AdminProvider';
const usePublishedCheckInAnalytics = () => {
  const { fetchPublishedCheckInAnalytics } = useAdminService();
  const { publishedCheckIn, setCheckInAnalytics } = useAdmin();

  return useQuery({
    queryKey: ['publishedCheckinAnalytics'],
    queryFn: () => {
      console.log('making api call for publish check in analytics');
      return fetchPublishedCheckInAnalytics(publishedCheckIn.checkInId);
    },
    onSuccess: (data) => {
      if (data) {
        setCheckInAnalytics(data);
      } else {
        setCheckInAnalytics({});
      }
    },
    enabled: publishedCheckIn !== null,
    staleTime: 1000 * 60 * 10 // Cache for 10 minutes
  });
};

export default usePublishedCheckInAnalytics;
