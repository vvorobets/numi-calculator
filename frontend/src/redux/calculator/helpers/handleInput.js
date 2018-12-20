import { updateInput, updateOutput, handleError } from '../actions';
import { parseInput } from './parseInput';
import { calculate, reduceMarkdown } from './calculate';
import { checkVariables } from './checkVariables';

export const handleInput = (rowIndex, input) => (dispatch, getState) => {

    // markdown input
    let markdown = parseInput(input); // type: array of parsed input's elements with variables

    let includesPlainWords = false;
    markdown.forEach(item => {
        if (item.type === 'word') includesPlainWords = true;
    });
    if (includesPlainWords) markdown = checkVariables(markdown, rowIndex)(dispatch, getState); // markdown with variables
    dispatch(updateInput(rowIndex, input, markdown));

    let errors = '', reducedMarkdown = [], output = '';
 
    // check for errors
    markdown.forEach(item => {
        if(item.type === 'error') {
            errors += item.value;
        } else if (item.type === 'word') {
            errors += 'Words provided are no keywords';
        }
    });
    if (errors) { // dispatch errors and early escape for output
        dispatch(handleError(errors));
        dispatch(updateOutput(rowIndex, ''));
        return;
    }

    // calculate output
    reducedMarkdown = reduceMarkdown(markdown);
    if (reducedMarkdown) output = calculate(reducedMarkdown)(dispatch, getState); // type: string - result value
    dispatch(updateOutput(rowIndex, output));
};

