import { API_URLS } from '../../constants/application';
import useAxiosClient from '../../hooks/useAxiosClient';

const useUserService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors

  const fetchPublishedCheckin = async () => {
    try {
      console.log('fetching published check in');
      const response = await client.get(API_URLS.publishedCheckIn);
      console.log('response from published check in ', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching published check-in', error);
      throw error;
    }
  };

  const fetchAnsweredCheckin = async () => {
    try {
      const response = await client.get(API_URLS.answeredCheckIn);
      return response.data;
    } catch (error) {
      console.error('Error fetching answered check-in', error);
      throw error;
    }
  };

  const fetchAllUserSubmittedCheckIns = async () => {
    try {
      const response = await client.get(API_URLS.allUserSubmittedCheckIn);
      console.log('submitted checkins ', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching All User Submitted check-in', error);
      throw error;
    }
  };

  const submitCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.submtitCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error submitting check-in', error);
      throw error;
    }
  };

  return {
    fetchPublishedCheckin,
    fetchAnsweredCheckin,
    fetchAllUserSubmittedCheckIns,
    submitCheckIn
  };
};

export default useUserService;
