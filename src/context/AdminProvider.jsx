import { useContext, createContext, useState } from 'react';
import { useAuth } from './AuthProvider';
import { INTIAL_CHECKIN_STATE } from '../constants/application';

const AdminQuestionContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminQuestion = () => {
  const adminQuestionContext = useContext(AdminQuestionContext);

  if (!adminQuestionContext) {
    throw new Error('useAdminQuestion must be used within a AdminProvider');
  }

  return adminQuestionContext;
};
const AdminProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState(INTIAL_CHECKIN_STATE);
  const [submittedCheckIns, setSubmittedCheckIns] = useState([]);
  const [publishedCheckIn, setPublishedCheckIn] = useState(INTIAL_CHECKIN_STATE);
  // const { userState } = useAuth();

  // function saveCheckInQuestion(questionToSave) {
  //   setCheckIn((prevState) => ({
  //     ...prevState,
  //     createdBy: userState.firstName + ' ' + userState.lastName,
  //     questions: [
  //       ...prevState.questions,
  //       {
  //         ...questionToSave
  //       }
  //     ]
  //   }));
  // }

  function publishCheckIn() {
    setCheckIn((prevState) => ({
      ...prevState,
      published: true
    }));
  }

  const updateCheckInQuestion = (updatedQuestion) => {
    console.log('udapted question', updatedQuestion);
    setCheckIn((prevState) => ({
      ...prevState,
      questions: [
        ...prevState.questions.map((q) =>
          q.id === updatedQuestion.id ? updatedQuestion : q
        )
      ]
    }));
  };

  const ctxValue = {
    // saveCheckInQuestion,
    publishCheckIn,
    updateCheckInQuestion,
    setCheckIn,
    checkIn,
    submittedCheckIns,
    setSubmittedCheckIns,
    publishedCheckIn,
    setPublishedCheckIn
  };

  return (
    <AdminQuestionContext.Provider value={ctxValue}>
      {children}
    </AdminQuestionContext.Provider>
  );
};

export default AdminProvider;
