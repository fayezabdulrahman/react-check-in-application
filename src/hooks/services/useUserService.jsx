import { API_URLS } from '../../constants/application';
import useAxiosClient from '../../hooks/useAxiosClient';

const useUserService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors

  const fetchAllUserCheckIns = async () => {
    try {
      const response = await client.get(API_URLS.user.allUserCheckIns);
      return response.data;
    } catch (error) {
      console.error('Error fetching published check-in', error);
      throw error;
    }
  };

  const fetchAllUserSubmittedCheckIns = async () => {
    try {
      const response = await client.get(API_URLS.user.allUserSubmittedCheckIn);
      return response.data;
    } catch (error) {
      console.error('Error fetching All User Submitted check-in', error);
      throw error;
    }
  };

  const submitCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.user.submitCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting check-in', error);
      throw error;
    }
  };

  return {
    fetchAllUserCheckIns,
    fetchAllUserSubmittedCheckIns,
    submitCheckIn
  };
};

export default useUserService;
