import { client } from '../util/axios-util';
import { API_URLS } from '../constants/application';
export const createAdminCheckIn = async (payload) => {
  try {
    const response = await client.post(API_URLS.createCheckIn, payload);
    return response.data; // React Query needs the data returned
  } catch (error) {
    console.error('Error creating admin check-in', error);
    throw error; // Throw the error so React Query can handle it
  }
};

export const fetchAllAdminCheckIn = async () => {
  try {
    const response = await client.get(API_URLS.allAdminCheckIn);
    return response.data;
  } catch (error) {
    console.error('Error fetching all admin check-in ', error);
    throw error;
  }
};

export const fetchPublishedCheckInAnalytics = async (payload) => {
  try {
    const response = await client.post(API_URLS.publishedCheckInAnalytic, payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching published check-in analytics', error) ;
    throw error;
  }
};

export const publishNewCheckIn = async (payload) => {
  try {
    const response = await client.post(API_URLS.publishNewCheckIn, payload);
    return response.data;
  } catch (error) {
    console.error('Error fetching all admin check-in ', error);
    throw error;
  }
};

export const unPublishCheckIn = async (payload) => {
  try {
    const response = await client.post(API_URLS.unPublishCheckIn, payload);
    return response.data;
  } catch (error) {
    console.log('Error unpublishing check-in ', error);
    throw error;
  }
};

export const deleteCheckIn = async (payload) => {
  try {
    const response = await client.post(API_URLS.deleteCheckIn, payload);
    return response.data;
  } catch (error) {
    console.error('Error deleting check in ', error);
    throw error;
  }
};
