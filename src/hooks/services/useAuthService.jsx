import { API_AUTH_URLS } from '../../constants/application';
import useAxiosClient from '../../hooks/useAxiosClient';


const useAuthService = () => {
  const client = useAxiosClient(); // Get the Axios client with interceptors
  const registerUser = async (payload) => {
    try {
      const response = await client.post(API_AUTH_URLS.register, payload);
      return response.data; // React Query needs the data returned
    } catch (error) {
      console.error('Error Registering User In MongoDb', error);
      throw error; // Throw the error so React Query can handle it
    }
  };

  const fetchUser = async (auth0Id) => {
    try {
      const response = await client.post(API_AUTH_URLS.findUser, auth0Id);
      return response.data;
    } catch (error) {
      console.error('Error in finding user', error);
      throw error;
    }
  };

  const updateUserDetails = async (payload) => {
    try {
      const response = await client.post(API_AUTH_URLS.updatUser, payload);
      return response.data;
    } catch (error) {
      console.error('Error in finding user', error);
      throw error;
    }
  };

  return {
    fetchUser,
    registerUser,
    updateUserDetails
  };
};
export default useAuthService;
