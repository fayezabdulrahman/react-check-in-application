import { API_URLS } from '../../constants/application';
import useAxiosClient from '../../hooks/useAxiosClient';


const useAdminService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors

  const createAdminCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.createCheckIn, payload);
      return response.data; // React Query needs the data returned
    } catch (error) {
      console.error('Error creating admin check-in', error);
      throw error; // Throw the error so React Query can handle it
    }
  };

  const fetchAllAdminCheckIn = async () => {
    try {
      const response = await client.get(API_URLS.allAdminCheckInWithResponses);
      return response.data;
    } catch (error) {
      console.error('Error fetching all admin check-in ', error);
      throw error;
    }
  };

  const fetchPublishedCheckInAnalytics = async (checkInId) => {
    try {
      const response = await client.get(
        `${API_URLS.publishedCheckInAnalytic}?checkInId=${checkInId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching published check-in analytics', error);
      throw error;
    }
  };

  const publishNewCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.publishNewCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error publishing check-in ', error);
      throw error;
    }
  };

  const unPublishCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.unPublishCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error unpublishing check-in ', error);
      throw error;
    }
  };

  const deleteCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.deleteCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error deleting check in ', error);
      throw error;
    }
  };

  const updateCheckIn = async (payload) => {
    try {
      const response = await client.post(API_URLS.updateCheckIn, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating check in ', error);
      throw error;
    }
  };

  return {
    createAdminCheckIn,
    fetchAllAdminCheckIn,
    fetchPublishedCheckInAnalytics,
    publishNewCheckIn,
    unPublishCheckIn,
    deleteCheckIn,
    updateCheckIn
  };
};
export default useAdminService;
