import { handleActions } from 'redux-actions';
import types from './types';
import { types as userTypes } from '../user/types'; // one of the options to clear state after logout

const defaultState = { 
    input: '',
    output: '',
    variables: { 'Pi': Math.PI , 'E': Math.E, 'ppi': 96 },
    errorMessage: '',
    exchangeRates: {}
};

const calculator = handleActions({
    [types.UPDATE_INPUT]: (state, action) => ({ ...state, input: action.payload, errorMessage: '' }),
    [types.UPDATE_OUTPUT]: (state, action) => ({ ...state, output: action.payload }),
    [types.REFRESH]: (state) => ({ ...defaultState, exchangeRates: state.exchangeRates }),
    [types.HANDLE_ERROR]: (state, action) => ({ ...state, errorMessage: action.payload }),
    [types.SET_EXCHANGE_RATES]: (state, action) => ({ ...state, exchangeRates: action.payload }),
    [userTypes.LOGOUT]: () => ({ ...defaultState }),
}, defaultState);

export default calculator;