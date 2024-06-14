import { useContext, createContext, useState } from 'react';
import { useAuth } from './AuthProvider';

const AdminQuestionContext = createContext();
const INITAL_QUESTION_STATE = {
  label: '',
  componentType: 'text',
  selectOptions: [],
  radioOptions: [],
  isRequired: false
};

const INTIAL_CHECKIN_STATE = {
  isLatestCheckin: true,
  createdBy: '',
  checkInQuestions: []
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminQuestion = () => {
  const adminQuestionContext = useContext(AdminQuestionContext);

  if (!adminQuestionContext) {
    throw new Error('useAdminQuestion must be used within a AdminProvider');
  }

  return adminQuestionContext;
};
const AdminProvider = ({ children }) => {
  const [question, setQuestion] = useState(INITAL_QUESTION_STATE);
  const [questions, setQuestions] = useState([]);
  const [checkIn, setCheckIn] = useState(INTIAL_CHECKIN_STATE);
  const { userState } = useAuth();



  function updateRadioOptions(value) {
    setQuestion((prevState) => ({
      ...prevState,
      componentType: 'radio',
      radioOptions: value
    }));
  }

  function updateSelectOptions(value) {
    setQuestion((prevState) => ({
      ...prevState,
      componentType: 'select',
      selectOptions: value
    }));
  }

  function updateCheckbox(value) {
    setQuestion((prevState) => ({
      ...prevState,
      isRequired: value
    }));
  }

  function updateQuestionLabel(value) {
    setQuestion((prevState) => ({
      ...prevState,
      label: value
    }));
  }

  function saveQuestion(questionToSave) {
    setQuestions((prevState) => [...prevState, questionToSave]);

    // reset new question to add
    setQuestion(INITAL_QUESTION_STATE);
  }

  function saveCheckIn() {
    setCheckIn((prevState) => ({
        ...prevState,
        createdBy: userState.firstName + ' ' + userState.lastName,
        checkInQuestions: [...prevState.checkInQuestions, ...questions]
    }));

    console.log('inside save Checkin ', questions);

    // clear questions
    setQuestions([]);
  }

  const ctxValue = {
    updateCheckbox,
    updateQuestionLabel,
    updateRadioOptions,
    updateSelectOptions,
    saveQuestion,
    saveCheckIn,
    checkIn,
    questions,
    question
  };

  return (
    <AdminQuestionContext.Provider value={ctxValue}>
      {children}
    </AdminQuestionContext.Provider>
  );
};

export default AdminProvider;
