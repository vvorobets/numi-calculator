import { USER } from './types';

const DEFAULT_USER = { 
    username: '', email: '', token: '', userpic: '', 
    fetchingStatus: '', 
    loginErrorMessage: '', signupErrorMessage: '', editErrorMessage: '' 
};

const userReducer = (state = DEFAULT_USER, action) => {
    switch(action.type) {
        case USER.LOGIN:
        case USER.SIGNUP:
        case USER.EDIT:
            return { ...state, fetchingStatus: 'suspended', loginErrorMessage: '', signupErrorMessage: '', editErrorMessage: '' };
        case USER.LOGIN_ERROR:
            return { ...state, fetchingStatus: '', loginErrorMessage: action.message };
        case USER.SIGNUP_ERROR:
            return { ...state, fetchingStatus: '', signupErrorMessage: action.message };
        case USER.EDIT_ERROR:
            return { ...state, fetchingStatus: '', editErrorMessage: action.payload.message };
        case USER.LOGIN_SUCCESS:
        case USER.SIGNUP_SUCCESS:
            return { username: action.user.username, email: action.user.email, token: action.user.token, userpic: action.user.userpic, fetchingStatus: '' };
        case USER.EDIT_SUCCESS:
            return { ...state, userpic: action.payload.userpic, fetchingStatus: '' }; // username: action.user.username, token: action.user.token, 
        case USER.LOGOUT:
            return DEFAULT_USER;
        default:
            return state;
    }
}

export default userReducer;