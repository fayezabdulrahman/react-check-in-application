import { createContext, useContext, useState } from 'react';
import { INTIAL_CHECKIN_STATE } from '../constants/application';

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const userContext = useContext(UserContext);

  if (!UserContext) {
    throw new Error('useUser must be used within UserProvider');
  }

  return userContext;
};

const UserProvider = ({ children }) => {
  const [publishedCheckIn, setPublishedCheckIn] = useState(INTIAL_CHECKIN_STATE);

  const ctxValue = {
    publishedCheckIn,
    setPublishedCheckIn
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
