import { CALCULATOR } from './types';
import { USER } from '../user/types'; // one of the options to clear state after logout

const DEFAULT_CALCULATOR_STATE = { currentInput: '', buffer: '', history: [] };

const calculatorReducer = (state = DEFAULT_CALCULATOR_STATE, action) => {
    switch(action.type) {
        case CALCULATOR.UPDATE_INPUT:
            return { ...state, currentInput: action.input };
        case CALCULATOR.CALCULATE:
            return { ...state, currentInput: '', history: [ ...state.history, action.operation ]};
        case CALCULATOR.DELETE_ONE:
            return { ...state, history: [ ...state.history.slice(0, action.index), ...state.history.slice(action.index + 1) ] };
        case CALCULATOR.COPY_ONE:
            return { ...state, buffer: action.buffer };
        case CALCULATOR.REFRESH:
        case USER.LOGOUT:
            return DEFAULT_CALCULATOR_STATE;
        default:
            return state;
    }
}

export default calculatorReducer;