export const INTIAL_CHECKIN_STATE = {
    checkInId: undefined,
    createdBy: '',
    published: false,
    questions: []
};

export const INITAL_QUESTION_STATE = {
    id: undefined,
    label: '',
    componentType: 'text',
    selectOptions: [],
    radioOptions: [],
    isRequired: false
};

export const INITIAL_QUESTION_RESPONSE = {
    checkInId: undefined,
    submittedBy: undefined,
    answered: false,
    answers: []
}