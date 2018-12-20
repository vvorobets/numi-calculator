import { setVariable, handleError } from '../actions';

import { parseInput } from './parseInput';
import { FUNCTION_MAP } from './functions';
import { CONVERSIONS_MAP } from './conversions';
import { 
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST
} from './keywordsLists';

const KEYWORDS_TYPES = {
    variableName: 'variableName'
};

const KEYWORDS_SUBTYPES = {
    assign: 'assign'
};

export const calculate = arr => (dispatch, getState) => { // type: array
console.log('Calculating: ', arr);
    let variables = getState().calculator.variables;
    let VARIABLES_LIST = Object.keys(variables);
    let exchangeRates = getState().calculator.exchangeRates;

    // HANDLE ASSIGNING OF VARIABLES
    if (arr.length > 2 && arr[0].type === KEYWORDS_TYPES.variableName && arr[1].subtype === KEYWORDS_SUBTYPES.assign) {
        let res = calculate(arr.slice(2))(dispatch, getState);
        if (res) {
            if (arr[1].value === '+=') res += +variables[arr[0].value];
            else if (arr[1].value === '-=') res = variables[arr[0].value] - res;
            else if (arr[1].value === '*=') res *= variables[arr[0].value];
            else if (arr[1].value === '/=') res = variables[arr[0].value] / res;
            dispatch(setVariable(arr[0].value, res));
            return res.toString();
        } else return ''; // empty output if no meaningful result

    }

    // HANDLE VARIABLES WITHIN INPUT

    let arrWithReducedVariables = [];
    arr.forEach((item, i) => {
        if (item.type === KEYWORDS_TYPES.variableName) {
            // check if variable is assigned
            if (variables[item.value]) {
                let variable = reduceMarkdown(parseInput(variables[item.value].toString()));
                if (variable.length) {
                    variable.forEach(varItem => arrWithReducedVariables.push(varItem));
                }
            } else {
                dispatch(handleError('Variable is not assigned'));
                return '';
            }
        } else arrWithReducedVariables.push(item);
    });
    arr = arrWithReducedVariables;
console.log('arr with reduced vars', arr);                

    // PATTERNS
    if (!arr) return '';

    if (arr.length === 1) {
        if (arr[0].type === 'numberValue') return arr[0].value.toString();
        else return '';
    }

    if (arr.length === 2) {
        // just transcription of input: [arg1] [measureUnit]
        if (arr[0].type === 'numberValue' && (arr[1].subtype === 'percentage' || (arr[1].type === 'measureUnit' 
            && arr[1].subtype !== 'areaIdentifier' && arr[1].subtype !== 'volumeIdentifier'))) {
                return `${arr[0].value} ${arr[1].value}`;
        // $ [arg1]
        } else if (arr[0].value === '$' && arr[1].type === 'numberValue') {
            return `$${arr[1].value}`;

        // [function] (arg1)
        } else if (arr[0].subtype === 'Math' || arr[0].subtype === 'trigonometry' || arr[0].value === 'fromunix') {
            return FUNCTION_MAP[arr[0].value](parseFloat(arr[1].value)).toString();
        } else return '';
    }

    if (arr.length === 3) {
console.log('len 3');
        // simple two-operands operations [arg1] [operation] [arg2]
        if (arr[0].type === 'numberValue' && arr[0].type === 'numberValue') {
console.log('case3.1 [arg1] [operation] [arg2]');
            if (arr[1].subtype === 'add' || arr[1].subtype === 'subtract' 
                || arr[1].subtype === 'multiply' || arr[1].subtype === 'multiply-divide') {
                return FUNCTION_MAP[arr[1].subtype](+arr[0].value, +arr[2].value).toString();
            } else if (arr[1].subtype === 'bitwise') {
                return FUNCTION_MAP[arr[1].value](+arr[0].value, +arr[2].value).toString();
            }
        // $ [arg1] [quantifier]
        } else if (arr[0].value === '$' && arr[1].type === 'numberValue' && arr[2].subtype === 'scale') {
console.log('case3.2 $ [arg1] [quantifier]');            
            return `$${arr[1].value} ${arr[2].value}`;

        // just transcription of input: [arg1] [scale] [measureUnit] || [arg1] [area/volume identifier] [measureUnit]
        } else if (arr[0].type === 'numberValue' 
        && (arr[1].subtype === 'scale' || arr[1].subtype === 'areaIdentifier' || arr[1].subtype === 'volumeIdentifier')
        && (arr[2].type === 'measureUnit' )) {
console.log('case3.3 [arg1] [scale] [measureUnit]');            
            return `${arr[0].value} ${arr[1].value} ${arr[2].value}`;

        // [operation1] [arg1] [°] trigonometry with degrees TODO: convert
        } else if (arr[0].subtype === 'trigonometry' && arr[1].type === 'numberValue' && arr[2].value === '°') {
console.log('case3.4 [operation1] [arg1] [°]');            
            return FUNCTION_MAP[arr[0].value](CONVERSIONS_MAP['degree']['radian'](+arr[1].value)).toString();
        
        // [arg1] [operation1/2/3] [arg2] percentages 'as a % of', 'as a % on', 'as a % off' 
        } else if (arr[0].type === 'numberValue' && arr[2].type === 'numberValue' && arr[1].subtype === 'percentage') {
console.log('case3.5 [arg1] [%] [arg2]');            
            if (arr[1].value === 'as a % of') { return `${(arr[0].value/arr[2].value * 100).toFixed(2)}%` }
            if (arr[1].value === 'as a % on') { return `${(arr[0].value/(arr[0].value + arr[2].value) * 100).toFixed(2)}%` }
            if (arr[1].value === 'as a % off') { return `${(arr[0].value/(arr[2].value - arr[0].value) * 100).toFixed(2)}%` }
        // [arg1] [operation1] [arg2] number systems conversions
        } else if (arr[0].type === 'numberValue' && arr[1].subtype === 'conversion' && arr[2].subtype === 'numberSystem') {
console.log('case3.6 [arg1] [into] [hex]');            
            return FUNCTION_MAP[arr[2].value](+arr[0].value).toString();
        } else {
            console.log(`${(arr[0].value/arr[2].value * 100).toFixed(2)}%`)
            return '';
        }
    }

    // handle braces
    // TODO: braces multiplying, 2 (3) should return 6
    while (arr.indexOf('(') > -1 || arr.indexOf(')') > -1) {
        let openBracePosition = arr.indexOf('(');
        if (openBracePosition > -1) {
            let closingBracePosition = arr.lastIndexOf(')');
            if (closingBracePosition > -1) {
                if (openBracePosition < closingBracePosition) { // calculating inside brackets, recursively if needed
                    return calculate([...arr.slice(0, openBracePosition), ...parseInput(calculate(...arr.slice(openBracePosition+1, closingBracePosition))(dispatch, getState), ...arr.slice(closingBracePosition+1))])(dispatch, getState);
                }
            }
        }
        return '';
    }

    // test exchangeCurrency prototype
    let operationsToDo = arr.filter(item => item.type === 'operation');
    if (arr.length === 4 && operationsToDo.length ===1 && operationsToDo[0].subtype === 'conversion' 
        && arr[3].subtype === 'currency') {
        let amount = 0, currencyFrom, currencyTo;
        if (arr[0].type === 'numberValue') {
            amount = arr[0].value;
            currencyFrom = arr[1].value;
        } else if (arr[0].value === '$' && arr[1].type === 'numberValue') {
            currencyFrom = '$';
            amount = arr[1].value;
        } else return '';
        currencyTo = arr[3].value;
console.log('$ case: ', amount, currencyFrom, currencyTo);
        if (currencyFrom === currencyTo) return `${arr[0].value} ${arr[1].value}`
        if (currencyFrom === 'USD' || currencyFrom === '$') return `${(amount / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
        else if (currencyTo === 'USD') return `${(amount * exchangeRates[currencyFrom]).toFixed(2)} USD`;
        else if (currencyTo === '$') return `$${(amount * exchangeRates[currencyFrom]).toFixed(2)}`;
        else return `${(amount * exchangeRates[currencyFrom] / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
        // TODO: add cases for '$', uah, dollars, $ CAD, euro etc.
    }

    let firstOperandValue = 0, firstOperandType = '', secondOperandValue = 0, secondOperandType = '', resultValue = 0, resultMeasureUnit = '', resultType = '';
    
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].type === 'operation') {
            if (ONE_ARGUMENT_FUNCTIONS_LIST.includes(arr[i].value)) { // List for Math functions with pure numbers as arguments // TODO: handle radians
                if(arr[i+1] && arr[i+1].type === 'numberValue') {
                    return calculate([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)])(dispatch, getState)
                } else return '';
            } else if (TRIGONOMETRY_FUNCTIONS_LIST.includes(arr[i].value)) {
                if(arr[i+1] && arr[i+1].type === 'numberValue') {
                    if(arr[i+2] && arr[i+2].value === '°') {
                        console.error('Not implemented for now');
                        // TODO: convert
                        return calculate([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+3)])(dispatch, getState)
                    }
                    return calculate([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)])(dispatch, getState);
                } else return '';
            } 
            // if((arr[i+2] && arr[i+2].type === 'measureUnit') && pureScalesList.includes(arr[i+2].value)) { // TODO: make such list
                //     firstOperandType = arr[i+2].value;
        } else if (arr[i].type === 'numberValue') {
            firstOperandValue = arr[i].value;
            if (arr[i+1] && arr[i+1].type === 'operation') {
                if (arr[i+2] && arr[i+2].type === 'numberValue') {
                    secondOperandValue = arr[i+2].value;
                    switch(arr[i+1].value) {
                        case '+':
                            resultValue = firstOperandValue + secondOperandValue; break;
                        default:
                            continue;
                    }
                }
            }
        }
    // else if (arr[0].type === KEYWORDS_TYPES.variableName) {
    //     get value;
    //     firstOperandValue = variable.value, 
    //     if(variable.measureUnit) firstOperandType = variable.measureUnit;
    // } 
        else if (arr[i].value === '$') {
            firstOperandType = '$';
            if (arr[i+1] && arr[i+1].type === 'numberValue') {
                firstOperandValue = arr[i].value;
                // if(arr[i+2].type === 'measureUnit' && pureScalesList.includes(arr[i+2].value)) { // TODO: make such list
                //     firstOperandType = arr[i+2].value;
                // }
            } else return '';
        } else {
            return resultValue.toString();
        }
    }
    return '';
}

export const reduceMarkdown = markdown => {
    return markdown.filter(item => {
        return (item.type === 'numberValue' || item.type === 'measureUnit' 
            || item.type === 'variableName' || item.type === 'operation'); // wipe out comments, labels etc
    });
}

// regExp examples
// const pattern = {
//     weather: /What is the weather (.*?) in (\w+)\?$/,
//     moneyExchange: /Convert (\d+) (\w+) to (\w+)$/,
//     save: /Save title: (.*) body: (.*)/,
//     random: /.*?\s[\#\@\)\₴\?\$0]/,
//     quotes: /show quote/,
//     call = /(^)@hello(\s|$)/
// }

    // dispatch(setVariable(item.value, 'testValue'));
