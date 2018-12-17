import { handleActions } from 'redux-actions';
import types from './types';
import { USER } from '../user/types'; // one of the options to clear state after logout

const defaultState = { 
    currentInput: { input: '', markdown: [] }, 
    buffer: null, 
    history: [], 
    errorMessage: null 
};

const calculator = handleActions({
    [types.UPDATE_INPUT]: (state, action) => ({ ...state, currentInput: action.payload }),
    [types.CALCULATE]: (state, action) => ({ ...state, currentInput: { input: '', markdown: [] }, history: [ ...state.history, action.payload ]}),
    [types.HANDLE_ERROR]: (state, action) => ({ ...state, errorMessage: action.payload }),
    [types.COPY_ONE]: (state, action) => ({ ...state, buffer: action.payload }),
    [types.DELETE_ONE]: (state, action) => ({ ...state, history: [ ...state.history.slice(0, action.payload), ...state.history.slice(action.payload + 1) ] }),
    [types.REFRESH]: () => ({ ...defaultState }),
    [USER.LOGOUT]: () => ({ ...defaultState }),
}, defaultState);

export default calculator;