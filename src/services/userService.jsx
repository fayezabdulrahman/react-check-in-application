// // import { client } from '../util/axios-util';
// import { API_URLS } from '../constants/application';
// import useAxiosClient from '..//util/axios-util';

// export const fetchPublishedCheckin = async () => {
//   try {
//     const response = await client.get(API_URLS.publishedCheckIn);
//     return response.data; // React Query needs the data returned
//   } catch (error) {
//     console.error('Error fetching published check-in', error);
//     throw error; // Throw the error so React Query can handle it
//   }
// };

// export const fetchAnsweredCheckin = async () => {
//   try {
//     const response = await client.get(API_URLS.answeredCheckIn);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching answered check-in', error);
//     throw error; // Throw the error so React Query can handle it
//   }
// };

// export const fetchAllUserSubmittedCheckIns = async () => {
//     try {
//       const response = await client.get(API_URLS.allUserSubmittedCheckIn);
//       console.log('submitted checkins ', response);
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching All User Submitted check-in', error);
//       throw error; // Throw the error so React Query can handle it
//     }
//   };

// export const submitCheckIn = async (payload) => {
//   const response = await client.post(API_URLS.submtitCheckIn, payload);
//   return response.data;
// };

import { API_URLS } from '../constants/application';
import useAxiosClient from '../util/axios-util';

const useUserService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors

  const fetchPublishedCheckin = async () => {
    try {
      const response = await client.get(API_URLS.publishedCheckIn);
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
