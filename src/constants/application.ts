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

export const API_URLS = {
    publishedCheckIn: '/admin/publishedCheckin',
    answeredCheckIn: '/user/answeredCheckIn',
    submtitCheckIn: '/user/submitCheckIn',
    allUserSubmittedCheckIn: '/user/getAllSubmittedCheckIn'
}