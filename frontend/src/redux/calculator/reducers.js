import { handleActions } from 'redux-actions';
import types from './types';
import { USER } from '../user/types'; // one of the options to clear state after logout

const defaultState = { 
    buffer: null, 
    history: [{ 
        input: '',
        markdown: [],
        output: '' 
    }],
    variables: [{ name: 'Pi', value: Math.PI }, { name: 'E', value: Math.E }],
    errorMessage: null 
};

const calculator = handleActions({
    [types.UPDATE_INPUT]: (state, action) => ({
        ...state, 
        history: [
            ...state.history.slice(0, action.payload.index),
            { ...state.history[action.payload.index], input: action.payload.input, markdown: action.payload.markdown },
            ...state.history.slice(action.payload.index + 1) 
        ], 
        errorMessage: ''
    }),
    [types.UPDATE_OUTPUT]: (state, action) => ({
        ...state, 
        history: [
            ...state.history.slice(0, action.payload.index),
            { ...state.history[action.payload.index], output: action.payload.output },
            ...state.history.slice(action.payload.index + 1) 
        ]
    }),
    [types.SET_VARIABLE]: (state, action) => ({ ...state, variables: [ ...state.variables, action.payload ]}),
    [types.HANDLE_ERROR]: (state, action) => ({ ...state, errorMessage: action.payload }),
    [types.ADD_LINE]: (state) => ({ ...state, history: [ ...state.history, { input: '', markdown: [], output: '' }], errorMessage: '' }),
    [types.DELETE_LINE]: (state, action) => ({ ...state, history: [ ...state.history.slice(0, action.payload), ...state.history.slice(action.payload + 1) ]}),
    [types.REFRESH]: () => ({ ...defaultState }),
    [USER.LOGOUT]: () => ({ ...defaultState }),
}, defaultState);

export default calculator;