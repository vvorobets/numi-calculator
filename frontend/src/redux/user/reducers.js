import { types } from './types';

const DEFAULT_USER = { 
    username: '', email: '', token: '', userpic: 'noavatar.png', 
    savedNotes: [],
    fetchingStatus: '', 
    loginErrorMessage: '', signupErrorMessage: '', editErrorMessage: '' 
};

const userReducer = (state = DEFAULT_USER, action) => {
    switch(action.type) {
        case types.LOGIN:
        case types.SIGNUP:
        case types.EDIT:
            return { ...state, fetchingStatus: 'suspended', loginErrorMessage: '', signupErrorMessage: '', editErrorMessage: '' };
        case types.LOGIN_ERROR:
            return { ...DEFAULT_USER, loginErrorMessage: action.message };
        case types.SIGNUP_ERROR:
            return { ...DEFAULT_USER, signupErrorMessage: action.message };
        case types.EDIT_ERROR:
            return { ...state, fetchingStatus: '', editErrorMessage: action.payload };
        case types.LOGIN_SUCCESS:
            return { ...DEFAULT_USER, username: action.user.username, email: action.user.email, token: action.user.token, 
                userpic: action.user.userpic || 'noavatar.png', savedNotes: action.user.savedNotes };
        case types.SIGNUP_SUCCESS:
            return { ...DEFAULT_USER, username: action.user.username, email: action.user.email, token: action.user.token };
        case types.EDIT_SUCCESS:
            return { ...state, userpic: action.payload.userpic, fetchingStatus: '' }; // username: action.user.username, token: action.user.token, 
        case types.SAVE_NOTE:
            return { ...state, fetchingStatus: 'suspended'}
        case types.SAVE_NOTE_ERROR:
            return { ...state, fetchingStatus: '' } // TODO: add error messages
        case types.SAVE_NOTE_SUCCESS:
            return { ...state, savedNotes: action.payload.savedNotes, fetchingStatus: '' }
        case types.LOGOUT:
            return DEFAULT_USER;
        default:
            return state;
    }
}

export default userReducer;