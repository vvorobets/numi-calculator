import { handleActions } from 'redux-actions';
import types from './types';
import { USER } from '../user/types'; // one of the options to clear state after logout

const defaultState = { 
    input: '',
    output: '',
    variables: { 'Pi': Math.PI , 'E': Math.E, 'ppi': 96 },
    errorMessage: '',
    exchangeRates: {},
    savedNotes: {}
};

const calculator = handleActions({
    [types.UPDATE_INPUT]: (state, action) => ({ ...state, input: action.payload, errorMessage: '' }),
    [types.UPDATE_OUTPUT]: (state, action) => ({ ...state, output: action.payload }),
    [types.REFRESH]: (state) => ({ ...defaultState, exchangeRates: state.exchangeRates }),
    [types.HANDLE_ERROR]: (state, action) => ({ ...state, errorMessage: action.payload }),

    // [types.SAVE_NOTE]: (state) => ({ ...state }),
    // [types.FETCH_SAVED]: (state) => ({ ...state }),
    // [types.SAVE_NOTE_ERROR]: (state) => ({ ...state }),
    // [types.SAVE_NOTE_SUCCESS]: (state) => ({ ...state }),
    // [types.FETCH_SAVED_ERROR]: (state) => ({ ...state }),

    [types.FETCH_SAVED_SUCCESS]: (state, action) => ({ ...state, savedNotes: action.payload }),
    [types.SET_EXCHANGE_RATES]: (state, action) => ({ ...state, exchangeRates: action.payload }),
    [USER.LOGOUT]: () => ({ ...defaultState }),
}, defaultState);

export default calculator;