import { parseInput } from './parseInput';
import { FUNCTION_MAP } from './functions';
import { 
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST, MULTIWORD_KEYWORDS
} from './keywordsLists';

export const calculateParsedInput = arr => (dispatch, getState) => { // type: array
    
    let variables = getState().calculator.variables;
    let VARIABLES_LIST = Object.keys(variables);
    let exchangeRates = getState().calculator.exchangeRates;

    // test for eval()
    if (!arr) return '';
    let stringifiedInput = arr.map(item => item.value).join(' ');
    let testForEval = true
    for (let n of stringifiedInput) {
        if (!/[()\d+/*|^&<>\s/xob-]/.test(n)) testForEval = false;
    };
    if (testForEval) {
        try {
            let res = eval(stringifiedInput);
            if (!isNaN(res)) return res.toString();
            else return '';
        } catch(error) {
            console.error(error);
        }
    };

    if (arr.length === 1) {
        if (arr[0].type === 'numberValue') return arr[0].value.toString();
        else if (arr[0].type === 'variableName') return variables[arr[0].value];
        else return '';
    }

    // handle braces
    // TODO: braces multiplying, 2 (3) should return 6
    while (arr.indexOf('(') > -1 || arr.indexOf(')') > -1) {
        let openBracePosition = arr.indexOf('(');
        if (openBracePosition > -1) {
            let closingBracePosition = arr.lastIndexOf(')');
            if (closingBracePosition > -1) {
                if (openBracePosition < closingBracePosition) { // calculating inside brackets, recursively if needed
                    return calculateParsedInput([...arr.slice(0, openBracePosition), ...parseInput(calculateParsedInput(...arr.slice(openBracePosition+1, closingBracePosition)), ...arr.slice(closingBracePosition+1))]);
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
        } else if (arr[0].value === '$' || arr[1].type === 'numberValue') {
            currencyFrom = 'USD';
            amount = arr[0].value;
        } else return '';
        currencyTo = arr[3].value;
        if (currencyFrom === 'USD') return `${(amount / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
        else if (currencyTo === 'USD') return `${(amount * exchangeRates[currencyFrom]).toFixed(2)} USD`;
        else return `${(amount * exchangeRates[currencyFrom] / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
        // TODO: add cases for '$', uah, dollars, $ CAD, euro etc.
    }

    let firstOperandValue = 0, firstOperandType = '', secondOperandValue = 0, secondOperandType = '', resultValue = 0, resultMeasureUnit = '', resultType = '';
    
    for(let i = 0; i < arr.length; i++) {
        if (arr[i].type === 'operation') {
            if (ONE_ARGUMENT_FUNCTIONS_LIST.includes(arr[i].value)) { // List for Math functions with pure numbers as arguments // TODO: handle radians
                if(arr[i+1] && arr[i+1].type === 'numberValue') {
                    return calculateParsedInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)])
                } else return '';
            } else if (TRIGONOMETRY_FUNCTIONS_LIST.includes(arr[i].value)) {
                if(arr[i+1] && arr[i+1].type === 'numberValue') {
                    if(arr[i+2] && arr[i+2].value === '°') {
                        console.error('Not implemented for now');
                        // TODO: convert
                        return calculateParsedInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+3)])
                    }
                    return calculateParsedInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)]);
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
    // else if (arr[0].type === 'variableName') {
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

