import { create } from 'zustand';
import { produce } from 'immer';

const useCheckInStore = create((set) => ({
  questions: [],
  checkInId: null,
  createdBy: null,
  published: false,
  questionType: '',
  toggleModal: false,
  questionToEdit: null,
  setQuestionToEdit: (question) =>
    set(
      produce((state) => {
        state.questionToEdit = state.questions.find(
          (q) => q.id === question.id
        );
        state.toggleModal = !state.toggleModal;
      })
    ),
  updateQuestion: (question) =>
    set(
      produce((state) => {
        const index = state.questions.findIndex((q) => q.id === question.id);
        console.log('index of questoin to update ', index);

        if (index !== -1) {
          state.questions[index] = {
            ...state.questions[index],
            ...question
          };
        }
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
  addQuestion: (question) =>
    set(
      produce((state) => {
        const newQuestion = {
          ...question,
          id: state.questions.length
        };
        state.questions.push(newQuestion);
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

  resetQuestions: () =>
    set(
      produce((state) => {
        state.questions = [];
      })
    )
}));

export default useCheckInStore;
