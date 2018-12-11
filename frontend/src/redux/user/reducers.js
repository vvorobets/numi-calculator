import { USER } from './types';

const DEFAULT_USER = { username: '', email: '', token: '', fetchingStatus: '', loginErrorMessage: '', signupErrorMessage: '' };

const userReducer = (state = DEFAULT_USER, action) => {
    switch(action.type) {
        case USER.LOGIN:
        case USER.SIGNUP:
            return { ...state, fetchingStatus: 'suspended', loginErrorMessage: '', signupErrorMessage: '' };
        case USER.LOGIN_ERROR:
            return { ...state, fetchingStatus: '', loginErrorMessage: action.message };
        case USER.SIGNUP_ERROR:
            return { ...state, fetchingStatus: '', signupErrorMessage: action.message };
        case USER.LOGIN_SUCCESS:
        case USER.SIGNUP_SUCCESS:
            return { username: action.user.username, email: action.user.email, token: action.user.token, fetchingStatus: '' };
        case USER.LOGOUT:
            return DEFAULT_USER;
        default:
            return state;
    }
}

export default userReducer;