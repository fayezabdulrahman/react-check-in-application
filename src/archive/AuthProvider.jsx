// import {
//   useContext,
//   createContext,
//   useEffect,
//   useLayoutEffect,
//   useState
// } from 'react';

// import { client } from '../util/axios-util.js';
// import Loading from '../components/shared/Loading.jsx';
// import { jwtDecode } from 'jwt-decode';
// import { useNavigate } from 'react-router-dom';
// import { useQueryClient } from '@tanstack/react-query';

// const AuthContext = createContext();
// const INITIAL_USER_STATE = {
//   id: undefined,
//   firstName: undefined,
//   lastName: undefined,
//   role: undefined
// };

// // eslint-disable-next-line react-refresh/only-export-components
// export const useAuth = () => {
//   const authContext = useContext(AuthContext);

//   if (!authContext) {
//     throw new Error('useAuth must be used within a AuthProvier');
//   }

//   return authContext;
// };

// const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(undefined);
//   const [userState, setUserState] = useState(INITIAL_USER_STATE);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // this gets called one time when app launches to determine if user is logged in or not.
//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         // console.log('intial call');
//         const response = await client.get('/auth/me');
//         const availableToken =
//           response.config.headers.Authorization?.split(' ')[1];
//         if (availableToken) {
//           setToken(availableToken);
//         } else {
//           setToken(null);
//         }
//       } catch (error) {
//         // console.log('error from /api/me', error);
//         setToken(null); // we tried to fetch api and theres no token
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUser();
//   }, []);

//   const login = async (user) => {
//     setLoading(true);

//     try {
//       await client.post('/auth/login', user).then((response) => {
//         console.log('response from server', response.data);
//         const token = response.data.token;

//         setToken(token);

//         const user = jwtDecode(token);
//         setUserState({
//           id: user.id,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           role: user.role
//         });

//         if (user.role === 'admin') {
//           navigate('/admin');
//         } else {
//           navigate('/home');
//         }
//         return response.data.message;
//       });
//     } catch (error) {
//       setToken(null);
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     await client
//       .post('/auth/logout')
//       .then(() => {
//         localStorage.clear();
//         queryClient.clear();
//         setToken(undefined);
//         setUserState(INITIAL_USER_STATE);
//       })
//       .catch((error) => console.log(error));
//       localStorage.clear();
//   };

//   const signUp = async (values) => {
//     try {
//       const response = await client.post('/auth/register', values);
//       console.log('response from backend on register', response);
//       return response;
//     } catch (error) {
//       console.log('registration failed', error);
//       throw error;
//     }
//   };

//   // interceptor for each request going out to the server so we include the token
//   useLayoutEffect(() => {
//     const authInterceptor = client.interceptors.request.use((config) => {
//       // console.log('config in request interceptor', config);
//       config.headers.Authorization =
//         !config._retry && token
//           ? `Bearer ${token}`
//           : config.headers.Authorization;

//       return config;
//     });

//     return () => {
//       client.interceptors.request.eject(authInterceptor);
//     };
//   }, [token]);

//   // interceptor for each response coming from server to check if user has valid token or not

//   useLayoutEffect(() => {
//     client.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       async (error) => {
//         const originalRequest = error.config;
//         // console.log('iniside response interceptor', error);
//         // console.log('response status', error.response.status);
//         if (error.response.status === 401 && !originalRequest._retry) {
//           try {
//             // console.log('calling refresh');
//             const response = await client.get('/auth/refreshToken');

//             // console.log('refresh response', response.data);

//             setToken(response.data.token);

//             reInitiliazeUserFromRefreshToken(response.data.token);

//             originalRequest._retry = true;
//             originalRequest.headers.Authorization = `Bearer ${response.data.token}`;

//             return client(originalRequest);
//           } catch (error) {
//             console.log('refresh response in catch block', error);

//             setToken(null);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );
//   }, []);

//   const reInitiliazeUserFromRefreshToken = (token) => {
//     const user = jwtDecode(token);
//     setUserState({
//       id: user.id,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       role: user.role
//     });
//   };

//   const ctxValue = {
//     token: token,
//     userState,
//     loading: loading,
//     setToken: setToken,
//     login: login,
//     logout: logout,
//     signUp: signUp
//   };

//   return (
//     <AuthContext.Provider value={ctxValue}>
//       {loading && <Loading />}
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
