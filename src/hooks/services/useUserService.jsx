import { API_URLS } from '../../constants/application';
import useAxiosClient from '../../hooks/useAxiosClient';

const useUserService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors

  const fetchAllPublishedCheckins = async () => {
    try {
      const response = await client.get(API_URLS.publishedCheckIns);
      return response.data;
    } catch (error) {
      console.error('Error fetching published check-in', error);
      throw error;
    }
  };

  const fetchAllUserCheckIns = async () => {
    try {
      const response = await client.get(API_URLS.allUserCheckIns);
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
    fetchAllUserCheckIns,
    fetchAllPublishedCheckins,
    fetchAnsweredCheckin,
    fetchAllUserSubmittedCheckIns,
    submitCheckIn
  };
};

export default useUserService;
