import { createContext, useContext, useState } from 'react';
import { INITIAL_QUESTION_RESPONSE, INTIAL_CHECKIN_STATE } from '../constants/application';

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
  const [publishedCheckIn, setPublishedCheckIn] = useState(null);
  const [questionResponse, setQuestionResponse] = useState(INITIAL_QUESTION_RESPONSE);
  const [submittedCheckIns, setSubmittedCheckIns] = useState(undefined);

  const ctxValue = {
    questionResponse, 
    setQuestionResponse,
    publishedCheckIn,
    setPublishedCheckIn,
    submittedCheckIns,
    setSubmittedCheckIns
  };

  return (
    <UserContext.Provider value={ctxValue}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
