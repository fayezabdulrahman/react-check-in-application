export const INITAL_QUESTION_STATE = {
    id: undefined,
    label: '',
    componentType: 'text',
    selectOptions: [],
    radioOptions: [],
    isRequired: false
};


export const API_URLS = {
    admin: {
        publishNewCheckIn: '/admin/publishCheckIn',
        unPublishCheckIn: '/admin/unPublishCheckIn',
        deleteCheckIn: '/admin/deleteCheckIn',
        createCheckIn: '/admin/createCheckin',
        updateCheckIn: '/admin/updateCheckIn',
        allAdminCheckInWithResponses: '/admin/allCheckinsWithResponses',

    },
    user: {
        allUserCheckIns: '/user/answeredCheckIn',
        answeredCheckIn: '/user/answeredCheckIn',
        submitCheckIn: '/user/submitCheckIn',
        allUserSubmittedCheckIn: '/user/getAllSubmittedCheckIn'
    }
}

export const API_AUTH_URLS = {
    register: '/auth/register',
    login: '/auth/login',
    findUser: '/auth/users',
    updatUser: '/auth/user/update'
}