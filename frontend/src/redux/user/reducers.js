import { types } from './types';

const DEFAULT_USER = { 
    username: '', email: '', token: '', userpic: '', 
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
            return { ...state, fetchingStatus: '', loginErrorMessage: action.message };
        case types.SIGNUP_ERROR:
            return { ...state, fetchingStatus: '', signupErrorMessage: action.message };
        case types.EDIT_ERROR:
            return { ...state, fetchingStatus: '', editErrorMessage: action.payload.message };
        case types.LOGIN_SUCCESS:
            return { username: action.user.username, email: action.user.email, token: action.user.token, userpic: action.user.userpic, 
                savedNotes: action.user.savedNotes, fetchingStatus: '' };
        case types.SIGNUP_SUCCESS:
            return { username: action.user.username, email: action.user.email, token: action.user.token, userpic: action.user.userpic, fetchingStatus: '' };
        case types.EDIT_SUCCESS:
            return { ...state, userpic: action.payload.userpic, fetchingStatus: '' }; // username: action.user.username, token: action.user.token, 
        case types.SAVE_NOTE:
        case types.FETCH_SAVED:
            return { ...state, fetchingStatus: 'suspended'}
        case types.SAVE_NOTE_ERROR:
        case types.FETCH_SAVED_ERROR:
            return { ...state, fetchingStatus: '' } // TODO: add error messages
        case types.SAVE_NOTE_SUCCESS:
        case types.FETCH_SAVED_SUCCESS:
            return { ...state, savedNotes: action.payload.savedNotes, fetchingStatus: '' }
        case types.LOGOUT:
            return DEFAULT_USER;
        default:
            return state;
    }
}

export default userReducer;