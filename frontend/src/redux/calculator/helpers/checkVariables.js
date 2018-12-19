import { handleError } from '../actions';
import { checkVariableName } from './checkVariableName';

export const checkVariables = (markdown, VARIABLES_LIST) => (dispatch, getState) => { // type: array of parsed input's elements
    
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
    if (indexOfAssignOperation) {
        let leftSideOfAssignExpression = markdownWithOldVariables.slice(0, indexOfAssignOperation).filter(item => {
            return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
            || item.type === 'operation' || item.type === 'variableName';
        });
        if (leftSideOfAssignExpression.length !==1 && leftSideOfAssignExpression[0].type !== 'word') {
            dispatch(handleError('Usage: [varName] = [value]'));
            return markdownWithOldVariables;
        }
    } else return markdownWithOldVariables;
    
    // check name
    const markdownWithNewVariables = markdown.map((item, i) => {
        if (item.type === 'word') {
            let checkedVariable = checkVariableName(item.value);
            if (checkedVariable.type === 'variableName') return checkedVariable;
            else dispatch(handleError(checkedVariable.value));
        } else return item;
    });

    return markdownWithNewVariables;
}