import { updateInput, updateOutput, setVariable, handleError } from '../actions';
import { parseInput } from './parseInput';
import { calculateParsedInput } from './calculateParsedInput';
import { checkVariableName } from './checkVariableName';

export const handleInput = (rowIndex, input) => (dispatch, getState) => {

    let variables = getState().calculator.variables;
    let VARIABLES_LIST = Object.keys(variables);
    let exchangeRates = getState().calculator.exchangeRates;

    const markdown = parseInput(input); // type: array of parsed input's elements
    const markdownWithVariables = markdown.map(item => {
        if (item.type === 'word') {
            return checkVariableName(item.value);
        } else return item;
    })

    dispatch(updateInput(rowIndex, input, markdownWithVariables));

    let errors = 0, output, reducedMarkdown = [];
    if (markdown) {
        markdown.forEach(item => {
            if(item.type === 'error') {
                errors++;
                dispatch(handleError(item.value));
                
            } else if (item.type === 'word') {
                errors++;
                dispatch(handleError('Words provided are no keywords'));
                
            } else if (item.type === 'variableName') {
                dispatch(setVariable(item.value, 'testValue'));
            }
        });
        reducedMarkdown = markdown.filter(item => {
            return (item.type === 'numberValue' || item.type === 'measureUnit' 
                || item.type === 'variableName' || item.type === 'operation'); // wipe out comments, labels etc
        });
    };
    if(errors) output = '';
    else if (reducedMarkdown) output = calculateParsedInput(reducedMarkdown); // type: string - result value
    dispatch(updateOutput(rowIndex, output));
};

// let reducedParsedExpression = parsedExpression.filter(item => {
//     return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
//     || item.type === 'operation' || item.type === 'variableName';
// });
// if (reducedParsedExpression.length !==1 && reducedParsedExpression[0].type !== 'word') parsedExpression.push({ type: 'error', value: 'Usage: [varName] = [value]' });
// else {
//     let varIndex;
//     parsedExpression.forEach((item, i) => {
//         if (item.type === 'word') {
//             varIndex = i; 
//         }
//     });
//     parsedExpression[varIndex] = checkVariableName(reducedParsedExpression[0].value);
// }
