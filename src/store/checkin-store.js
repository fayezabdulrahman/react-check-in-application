import { create } from 'zustand';
import { produce } from 'immer';

const useCheckInStore = create((set) => ({
  questions: [],
  nextQuestionId: 0,
  submittedCheckInToEditQuestions: [],
  questionType: '',
  toggleModal: false,
  toggleEditModal: false,
  toggleDeleteModal: false,
  toggleDuplicateModal: false,
  duplicateCheckInData: null,
  deleteModalConfig: {
    id: null,
    header: '',
    body: '',
    onConfirm: null
  },
  toggleUserViewSubmittedCheckInModal: false,
  userViewSubmittedCheckIn: null,
  questionToEdit: null,
  submittedCheckInToEdit: null,
  adminAction: {
    actionInProgress: false,
    actionType: null
  },
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
  setToggleDuplicateModal: (checkInToDuplicate) =>
    set(
      produce((state) => {
        state.toggleDuplicateModal = !state.toggleDuplicateModal;
        state.duplicateCheckInData = {
          createdBy: checkInToDuplicate.createdBy,
          published: false,
          questions: checkInToDuplicate.questions,
          anonymous: checkInToDuplicate.anonymous
        };
      })
    ),
  setToggleEditModal: () =>
    set((state) => ({ toggleEditModal: !state.toggleEditModal })),
  openDeleteModal: (config) =>
    set(
      produce((state) => {
        state.toggleDeleteModal = !state.toggleDeleteModal;
        state.deleteModalConfig = {
          id: config.id,
          header: config.header,
          body: config.body,
          onConfirm: config.onConfirm
        };
      })
    ),
  closeDeleteModal: () =>
    set(
      produce((state) => {
        state.toggleDeleteModal = !state.toggleDeleteModal;
        state.deleteModalConfig = {
          id: null,
          header: '',
          body: '',
          onConfirm: null
        };
      })
    ),

  closeDuplicateModal: () =>
    set(
      produce((state) => {
        state.toggleDuplicateModal = !state.toggleDuplicateModal;
        state.duplicateCheckInData = null;
      })
    ),
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
        state.nextQuestionId = 0;
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
    ),
  resetQuestionToEdit: () =>
    set(
      produce((state) => {
        state.questionToEdit = null;
      })
    ),
  resetSubmittedCheckInToEdit: () =>
    set(
      produce((state) => {
        state.submittedCheckInToEdit = null;
        state.submittedCheckInToEditQuestions = [];
      })
    )
}));

export default useCheckInStore;
