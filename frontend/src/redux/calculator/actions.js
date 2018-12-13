import { CALCULATOR } from './types';

import { parseInput } from './operations';

export const updateInput = (input) => dispatch => {
    dispatch({ type: CALCULATOR.UPDATE_INPUT, input });
};

export const calculate = (input) => dispatch => {
    dispatch({ type: CALCULATOR.CALCULATE, operation: { input, output: parseInput(input) } });
};

export const deleteOne = (index) => dispatch => {
    dispatch({ type: CALCULATOR.DELETE_ONE, index });
};

export const copyOne = (buffer) => dispatch => {
    dispatch({ type: CALCULATOR.COPY_ONE, buffer });
};

export const refresh = () => dispatch => {
    dispatch({ type: CALCULATOR.REFRESH });
};

export const handleError = (error) => dispatch => {
    dispatch({ type: CALCULATOR.HANDLE_ERROR, error });
};