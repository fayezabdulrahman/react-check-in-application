import { create } from 'zustand';
import { produce } from 'immer';

const useCheckInStore = create((set) => ({
  questions: [],
  nextQuestionId: 0,
  submittedCheckInToEditQuestions: [],
  checkInId: null,
  createdBy: null,
  published: false,
  questionType: '',
  toggleModal: false,
  toggleEditModal: false,
  toggleUserViewSubmittedCheckInModal: false,
  userViewSubmittedCheckIn: null,
  questionToEdit: null,
  publishedCheckIn: null,
  checkInResponses: [],
  submittedCheckInToEdit: null,
  adminAction: {
    actionInProgress: false,
    actionType: null
  },
  userCheckInAnswers: {
    checkInId: null,
    submittedBy: null,
    answers: []
  },
  userAnsweredCheckIn: false,
  setUserAnsweredCheckIn: (boolean) =>
    set(
      produce((state) => {
        state.userAnsweredCheckIn = boolean;
      })
    ),
  allUserSubmittedCheckIns: [],
  setAllUserSubmittedCheckIns: (userSubmittedCheckins) =>
    set(
      produce((state) => {
        state.allUserSubmittedCheckIns = userSubmittedCheckins;
      })
    ),
  setUserCheckInAnswers: (partial) =>
    set(
      produce((state) => {
        state.userCheckInAnswers = {
          ...state.userCheckInAnswers,
          ...partial
        };
      })
    ),
  setAdminAction: (actionType) =>
    set(
      produce((state) => {
        state.adminAction = {
          actionInProgress: true,
          actionType: actionType
        };
      })
    ),
  setSubmittedCheckInToEdit: (checkIn) =>
    set(
      produce((state) => {
        state.submittedCheckInToEdit = checkIn;
        state.submittedCheckInToEditQuestions = checkIn.questions;
        state.toggleEditModal = !state.toggleEditModal;
      })
    ),
  setCheckInResponses: (checkInResponses) =>
    set(
      produce((state) => {
        state.checkInResponses = checkInResponses;
      })
    ),
  setPublishedCheckIn: (checkIn) =>
    set(
      produce((state) => {
        state.publishedCheckIn = checkIn;
      })
    ),
  setQuestionToEdit: (question) =>
    set(
      produce((state) => {
        state.questionToEdit = state.questions.find(
          (q) => q.id === question.id
        );
        state.questionType = question.componentType;
        state.toggleModal = !state.toggleModal;
      })
    ),
  setSubmittedCheckInQuestionToEdit: (question) =>
    set(
      produce((state) => {
        state.questionToEdit = state.submittedCheckInToEditQuestions.find(
          (q) => q.id === question.id
        );
        state.questionType = question.componentType;
        state.toggleModal = !state.toggleModal;
      })
    ),
  updateQuestion: (question) =>
    set(
      produce((state) => {
        const index = state.questions.findIndex((q) => q.id === question.id);

        if (index !== -1) {
          state.questions[index] = {
            ...state.questions[index],
            ...question
          };
        }
        state.questionToEdit = null;
      })
    ),
  updateSubmittedQuestion: (question) =>
    set(
      produce((state) => {
        const index = state.submittedCheckInToEditQuestions.findIndex(
          (q) => q.id === question.id
        );

        if (index !== -1) {
          state.submittedCheckInToEditQuestions[index] = {
            ...state.submittedCheckInToEditQuestions[index],
            ...question
          };
        }
        // updated the submittedEditCheckIn Store ( so its not stale )
        state.submittedCheckInToEdit = {
          ...state.submittedCheckInToEdit,
          questions: state.submittedCheckInToEditQuestions
        };
        state.questionToEdit = null;
      })
    ),
  setQuestionType: (questionType) =>
    set(
      produce((state) => {
        state.questionType = questionType;
      })
    ),
  setToggleModal: () => set((state) => ({ toggleModal: !state.toggleModal })),
  setToggleUserViewSubmittedCheckInModal: (checkInIdToView) =>
    set(
      produce((state) => {
        state.userViewSubmittedCheckIn = checkInIdToView;
        state.toggleUserViewSubmittedCheckInModal =
          !state.toggleUserViewSubmittedCheckInModal;
      })
    ),
  setToggleEditModal: () =>
    set((state) => ({ toggleEditModal: !state.toggleEditModal })),
  addQuestion: (question) =>
    set(
      produce((state) => {
        const newQuestion = {
          ...question,
          id: state.nextQuestionId
        };
        state.questions.push(newQuestion);
        state.nextQuestionId += 1;
      })
    ),
  removeQuestion: (questionId) =>
    set(
      produce((state) => {
        state.questions = state.questions.filter(
          (question) => question.id !== questionId
        );
      })
    ),
  removeQuestionFromSubmittedCheckIn: (questionId) =>
    set(
      produce((state) => {
        state.submittedCheckInToEditQuestions =
          state.submittedCheckInToEditQuestions.filter(
            (question) => question.id !== questionId
          );
      })
    ),
  resetQuestions: () =>
    set(
      produce((state) => {
        state.questions = [];
      })
    ),
  resetAdminAction: () =>
    set(
      produce((state) => {
        state.adminAction = {
          actionInProgress: false,
          actionType: null
        };
      })
    )
}));

export default useCheckInStore;
