import { USER } from './types';

const DEFAULT_USER = { username: '', email: '', fetchingStatus: '' };

const userReducer = (state = DEFAULT_USER, action) => {
    switch(action.type) {
        case USER.LOGIN:
        case USER.SIGNUP:
            return { ...state, fetchingStatus: 'suspended', errorMessage: '' };
        case USER.LOGIN_ERROR:
        case USER.SIGNUP_ERROR:
            return { ...state, fetchingStatus: '', errorMessage: action.message };
        case USER.LOGIN_SUCCESS:
        case USER.SIGNUP_SUCCESS:
            return { username: action.user.username, email: action.user.email, fetchingStatus: '' };
        case USER.LOGOUT:
            return DEFAULT_USER;
        default:
            return state;
    }
}

export default userReducer;