import { useContext, createContext, useState } from 'react';
import { client } from '../../util/axios-util';
import { useCookies } from 'react-cookie';
import { jwtDecode } from 'jwt-decode';

const INITIAL_AUTH_STATE = {
  id: '',
  firstName: '',
  lastName: '',
  role: ''
};

export const UserContext = createContext({
  user: INITIAL_AUTH_STATE,
  login: () => {},
  logout: () => {},
  cookie: null
});

const UserProvider = ({ children }) => {
  //   const navigate = useNavigate();
  const [cookies, setCookies, removeCookie] = useCookies();
  const [authState, setAuthState] = useState(INITIAL_AUTH_STATE);

  const login = async (userInfo) => {
    await client
      .post('/login', userInfo)
      .then((response) => {
        const token = response.data.token;
        setCookies('token', token);
        const extractedToken = jwtDecode(token);
        console.log(extractedToken);
        setAuthState({
          id: extractedToken.id,
          firstName: extractedToken.firstName,
          lastName: extractedToken.lastName,
          role: 'user'
        });
        // navigate('/homepage');
      })
      .catch((error) => console.log(error));
  };

  const logout = async () => {
    await client
      .post('/logout')
      .then((response) => console.log(response.data))
      .catch((error) => console.log(error));
    removeCookie('token');
    setAuthState(INITIAL_AUTH_STATE);
    // navigate('/');
  };

  const ctxValue = {
    user: authState,
    login: login,
    logout: logout,
    cookie: cookies
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
