import { createContext, useContext, useState } from 'react';
import {
  INTIAL_CHECKIN_STATE,
  INITAL_QUESTION_STATE
} from '../constants/application';

const CheckinContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCheckin = () => {
  const context = useContext(CheckinContext);
  if (!context)
    throw new Error('useCheckin must be used within CheckinProvider');
  return context;
};

export const CheckinProvider = ({ children }) => {
  const [checkIn, setCheckIn] = useState(INTIAL_CHECKIN_STATE);

  // Form Building State
  // TODO LOOK TO MOVE formData to QuestionModal instead of being global state
  const [formData, setFormData] = useState(INITAL_QUESTION_STATE);
  const [formQuestions, setFormQuestions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [submittedCheckInToEdit, setSubmittedCheckInToEdit] = useState(null);

  const questionTypes = [
    { type: 'text', label: 'Short Text' },
    { type: 'textarea', label: 'Long Text' },
    { type: 'select', label: 'Multiple Choice' },
    { type: 'radio', label: 'Checkbox' }
  ];

  const generateUniqueId = () => Date.now() + Math.random();

  const handleAddQuestion = (question) => {
    question = {
      ...question,
      id: generateUniqueId()
    };
    setFormQuestions((prevQuestions) => [...prevQuestions, question]);
    setFormData(INITAL_QUESTION_STATE);
  };

  const handleEditQuestion = (id, updatedData) => {
    setFormQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === id ? { ...question, ...updatedData } : question
      )
    );
    setFormData(INITAL_QUESTION_STATE);
  };

  const handleDeleteQuestion = (id) => {
    setFormQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== id)
    );
  };


  return (
    <CheckinContext.Provider
      value={{
        checkIn,
        setCheckIn,
        questionTypes,
        isModalOpen,
        editingQuestion,
        selectedQuestionType,
        formQuestions,
        formData,
        submittedCheckInToEdit,
        setFormData,
        setFormQuestions,
        setSubmittedCheckInToEdit,
        actions: {
          openModal: (type) => {
            setSelectedQuestionType(type);
            setIsModalOpen(true);
            setEditingQuestion(null);
          },
          closeModal: () => {
            setIsModalOpen(false);
            setEditingQuestion(null);
            setSelectedQuestionType(null);
            setFormData(INITAL_QUESTION_STATE);
          },
          addQuestion: handleAddQuestion,
          editQuestion: handleEditQuestion,
          deleteQuestion: handleDeleteQuestion,
          startEditing: (question) => {
            setSelectedQuestionType(question.componentType);
            setIsModalOpen(true);
            setEditingQuestion(question);
          },
          startEdittingSubmittedCheckIn: (checkIn) => {
            setSubmittedCheckInToEdit(checkIn);
            setFormQuestions(checkIn.questions);
          },
          resetForm: () => {
            setFormQuestions([]);
            setCheckIn(INTIAL_CHECKIN_STATE);
          },
          resetSubmittedCheckInToEdit:() => {
            setSubmittedCheckInToEdit(null);
            setFormQuestions([]);
          }
        }
      }}
    >
      {children}
    </CheckinContext.Provider>
  );
};
