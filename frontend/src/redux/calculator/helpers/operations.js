import { updateInput, updateOutput, setVariable, handleError } from '../actions';
import { parseInput } from './parseInput';
import { calculateParsedInput } from './calculateParsedInput';
import { checkVariables } from './checkVariables';

export const handleInput = (rowIndex, input) => (dispatch, getState) => {

    let variables = getState().calculator.variables;
    let VARIABLES_LIST = Object.keys(variables);

    let markdown = parseInput(input); // type: array of parsed input's elements with variables

    let includesPlainWords = false;
    markdown.forEach(item => {
        if (item.type === 'word') includesPlainWords = true;
    });
    if (includesPlainWords) markdown = checkVariables(markdown, VARIABLES_LIST)(dispatch, getState); 

    dispatch(updateInput(rowIndex, input, markdown));

    let errors = '', reducedMarkdown = [], output = '';
    markdown.forEach(item => {
        if(item.type === 'error') {
            errors += item.value;
        } else if (item.type === 'word') {
            errors += 'Words provided are no keywords';
        }
    });
    reducedMarkdown = markdown.filter(item => {
        return (item.type === 'numberValue' || item.type === 'measureUnit' 
            || item.type === 'variableName' || item.type === 'operation'); // wipe out comments, labels etc
    });
    if (!errors && reducedMarkdown) output = calculateParsedInput(reducedMarkdown)(dispatch, getState); // type: string - result value
    dispatch(updateOutput(rowIndex, output));
    dispatch(handleError(errors));
};


