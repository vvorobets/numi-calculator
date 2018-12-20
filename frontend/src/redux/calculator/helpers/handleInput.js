import { updateInput, updateOutput, handleError } from '../actions';
import { parseInput } from './parseInput';
import { calculate, reduceParsedInput } from './calculate';
import { checkVariables } from './checkVariables';

export const handleInput = (input) => (dispatch, getState) => {

    dispatch(updateInput(input));
    
    // parse input
    let output = [];
    let variables = { 'Pi': Math.PI, 'E': Math.E, 'ppi': 96 };
    if (input) output = input.split('\n').map(row => {
        let parsedInput = parseInput(input), reducedInput; // type: array of parsed input's elements
        let includesPlainWords = false;
        parsedInput.forEach(elem => {
            if (item.type === 'error') {
                dispatch(handleError(item.value));
                return '';
            }
            if (item.type === 'word') includesPlainWords = true;
        });
        if (includesPlainWords) parsedInput = checkVariables(parsedInput)(dispatch, getState); // ParsedInput with variables
        // calculate output
        if (parsedInput) return calculate(parsedInput)(dispatch, getState); // type: string - result value
    });
};

