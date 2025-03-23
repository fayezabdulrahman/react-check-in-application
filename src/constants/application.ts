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

export const INITIAL_PERFORMING_ACTION_STATE = {
    actionInProgress: false,
    actionType: '',
    checkInId: ''
}

export const API_URLS = {
    publishedCheckIn: '/admin/publishedCheckin',
    publishNewCheckIn: '/admin/publishCheckIn',
    unPublishCheckIn: '/admin/unPublishCheckIn',
    publishedCheckInAnalytic: '/admin/checkInAnayltics',
    deleteCheckIn: '/admin/deleteCheckIn',
    createCheckIn: '/admin/createCheckin',
    updateCheckIn: '/admin/updateCheckIn',
    allAdminCheckIn: '/admin/allCheckins',
    answeredCheckIn: '/user/answeredCheckIn',
    submtitCheckIn: '/user/submitCheckIn',
    allUserSubmittedCheckIn: '/user/getAllSubmittedCheckIn'
}

export const API_AUTH_URLS = {
    register: '/auth/register',
    login: '/auth/login',
    findUser: '/auth/users',
    updatUser: '/auth/user/update'
}