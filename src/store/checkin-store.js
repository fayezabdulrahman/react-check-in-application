import { create } from 'zustand';

const useCheckInStore = create((set) => ({
  questions: [],
  checkInId: null,
  createdBy: null,
  published: false,
  addingQuestion: false,
  setAddingQuestion: () => set((state) => ({addingQuestion: !state.addingQuestion})),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  removeQuestion: (questionId) =>
    set((state) => ({
      questions: state.questions.filter(
        (question) => question.id !== questionId
      )
    }))
}));

export default useCheckInStore;