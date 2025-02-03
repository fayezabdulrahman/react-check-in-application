import { client } from '../util/axios-util';
import { API_URLS } from '../constants/application';
export const createAdminCheckIn = async (payload) => {
  try {
    const response = await client.post(API_URLS.createCheckIn, payload);
    return response.data; // React Query needs the data returned
  } catch (error) {
    console.error('Error fetching published check-in', error);
    throw error; // Throw the error so React Query can handle it
  }
};