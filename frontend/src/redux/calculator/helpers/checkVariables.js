import { handleError } from '../actions';
import { checkVariableName } from './checkVariableName';

export const checkVariables = (markdown, rowIndex) => (dispatch, getState) => { // type: array of parsed input's elements; 
    // @param rowIndex - index of input row from within there is a try to assign variable
    let variables = getState().calculator.variables;
    let VARIABLES_LIST = Object.keys(variables);

    // check existing variables
    const markdownWithOldVariables = markdown.map(item => {
        if (item.type === 'word' && VARIABLES_LIST.includes(item.value)) return { type: 'variableName', value: item.value };
        else return item;
    });

    // check the position
    let indexOfAssignOperation;
    markdownWithOldVariables.forEach((item, i) => {
        if (item.subtype === 'assign') indexOfAssignOperation = i;
    });
    if (indexOfAssignOperation) { // check left side of assignment
        let leftSideOfAssignExpression = markdownWithOldVariables.slice(0, indexOfAssignOperation).filter(item => {
            return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
            || item.type === 'operation' || item.type === 'variableName';
        });
        if (leftSideOfAssignExpression.length !==1 && leftSideOfAssignExpression[0].type !== 'word') {
            dispatch(handleError('Usage: [varName] = [value]'));
            return markdownWithOldVariables;
        }
    } else return markdownWithOldVariables;
    
    // check name // creates array, where new variable has type not 'word' but 'variableName'
    const markdownWithNewVariables = markdown.map((item, i) => {
        if (item.type === 'word') {
            let checkedVariable = checkVariableName(item.value);
            if (checkedVariable.type === 'variableName') return checkedVariable; // return type 'variableName' if all conditions are kept
            else dispatch(handleError(checkedVariable.value)); // show errors if variableName is incorrect
        }
        return item; // default return - copy existing element
    });

    return markdownWithNewVariables;
}