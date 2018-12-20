// redux
import { updateInput, updateOutput, handleError } from '../actions';
//helpers
import { parseInput } from './parseInput';
import { calculate, reduceParsedInput } from './calculate';
import { checkVariableName } from './checkVariableName';
import { KEYWORDS_TYPES, KEYWORDS_SUBTYPES } from './keywordsTypes';


export const handleInput = input => (dispatch, getState) => {

    dispatch(updateInput(input));
    if (!input) dispatch(handleError('Empty input'));
    
    let variables = { 'Pi': Math.PI, 'E': Math.E, 'ppi': 96 };
    let errors = '';

    // parse input
    let output = input.split('\n').map((row, i) => {
        if (!row) return ''; // empty output for that row
        
        let parsedRow = parseInput(row), reducedRow = []; // type: array of parsed input's elements
        let includesWords = false; // indicates possible variables or non-recognized words
        parsedRow.forEach(elem => {
            if (elem.type === 'error') {
                errors += `At row ${i+1} ${elem.value}`;
                return '';
            } else if (elem.type === 'word') {
                if (variables[elem.value]) reducedRow.push({ type: 'variableName', value: elem.value });
                else {
                    reducedRow.push(elem);
                    includesWords = true;
                }
            } else if (elem.type === 'numberValue' || elem.type === 'measureUnit' || elem.type === 'variableName'
                || elem.type === 'operation') {
                    reducedRow.push(elem);
                }; // wipe out comments, labels etc)
        });
        if (includesWords) {
            // check the position of possible variable - before '=' sign
            let indexOfAssign;
            reducedRow.forEach((item, j) => {
                if (item.subtype === 'assign') indexOfAssign = j;
            });
            if (!indexOfAssign || indexOfAssign !==1 || reducedRow[0].type !== 'word') {
                errors += `At row ${i+1} Usage: [varName] [+*/-]= [arg1 [operation [arg2]]]`
                return '';
            } else {
                let checkedVariable = checkVariableName(reducedRow[0].value);
                if (checkedVariable.type === 'variableName') reducedRow[0].type = 'variableName'; // return type 'variableName' if all conditions are kept
                else {
                    errors += `At row ${i+1} ${checkedVariable.value}`; // show errors if variableName is incorrect
                    return '';
                }
            }
        };
        // HANDLE ASSIGNING OF VARIABLES
        if (reducedRow[0] && reducedRow[0].type === KEYWORDS_TYPES.variableName 
            && reducedRow[1] && reducedRow[1].subtype === KEYWORDS_SUBTYPES.assign 
            && reducedRow.length > 2) {
            let res = calculate(reducedRow.slice(2))(dispatch, getState);
            if (res) {
                if(reducedRow[1].value === '=') variables[reducedRow[0].value] = +res;
                else if (reducedRow[1].value === '+=') variables[reducedRow[0].value] += parseFloat(res);
                else if (reducedRow[1].value === '-=') variables[reducedRow[0].value] -= res;
                else if (reducedRow[1].value === '*=') variables[reducedRow[0].value] *= res;
                else if (reducedRow[1].value === '/=') variables[reducedRow[0].value] /= res;
                return variables[reducedRow[0].value].toString();
            } else {
                errors += `At row ${i+1} Usage: [varName] [+*/-]= [arg1 [operation [arg2]]]`;
                return ''; // empty output if no meaningful result
            }
        }
        // APPLY VARIABLES VALUES INTO INPUT
        let arrWithVariables = [];
        reducedRow.forEach(elem => {
            if (elem.type === KEYWORDS_TYPES.variableName) {
                if (variables[elem.value]) {
                    let variableValue = reduceParsedInput(parseInput(variables[elem.value].toString()));
                    if (variableValue.length) variableValue.forEach(varElem => arrWithVariables.push(varElem));
                } else {
                    dispatch(handleError('Variable is not assigned'));
                    return '';
                }
            } else arrWithVariables.push(elem);
        });
        reducedRow = arrWithVariables;
        if (i === input.split('\n').length - 1) console.log('Calculating: ', reducedRow);
        if (reducedRow) return calculate(reducedRow)(dispatch, getState); // type: string - result value
    });
    if (errors) dispatch(handleError(errors));
    dispatch(updateOutput(output.join('\n')));
};

