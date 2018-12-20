import { handleError } from '../actions';

import { parseInput } from './parseInput';
import { FUNCTION_MAP } from './functions';
import { CONVERSIONS_MAP } from './conversions';
import { 
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST
} from './keywordsLists';
import { KEYWORDS_TYPES, KEYWORDS_SUBTYPES } from './keywordsTypes';

export const calculate = arr => (dispatch, getState) => { // type: array
console.log('Calculating...', arr);
    let exchangeRates = getState().calculator.exchangeRates;
    if (!arr) return '';
    const valuesArray = arr.map(item => item.value);

    // handle braces
    // TODO: braces multiplying, 2 (3) should return 6 
    while (valuesArray.indexOf('(') > -1 || valuesArray.indexOf(')') > -1) {
console.log('openBracePosition', valuesArray.indexOf('('), 'closingBracePosition', valuesArray.lastIndexOf(')'));
        let openBracePosition = valuesArray.indexOf('(');
        if (openBracePosition > -1) {
            let closingBracePosition = valuesArray.lastIndexOf(')');
            if (closingBracePosition > -1) {
                if (openBracePosition < closingBracePosition && ((closingBracePosition - openBracePosition) > 1)) { // calculating inside brackets, recursively if needed
                    const innerResult = calculate(arr.slice(openBracePosition+1, closingBracePosition))(dispatch, getState);
                    if (innerResult) {
                        if (arr[openBracePosition - 1] && arr[openBracePosition - 1].type === 'numberValue') {
                            return calculate([
                                ...arr.slice(0, openBracePosition),
                                { type: 'operation', subtype: 'multiply', value: '*' },
                                ...parseInput(innerResult),
                                ...arr.slice(closingBracePosition+1)
                            ])(dispatch, getState);
    
                            // arr.splice(openBracePosition - 1, 0, { type: 'operation', subtype: 'multiply', value: val })
                        }
                        return calculate([
                            ...arr.slice(0, openBracePosition),
                            ...parseInput(innerResult),
                            ...arr.slice(closingBracePosition+1)
                        ])(dispatch, getState);
                    }
                }
            }
        }
        return '';
    }

    // OPERATIONS PRIORITY
    // 1. braces
    // 2. 'Math', 'trigonometry', 'time'// func(x)
    // 3. 'conversion'// x * yRate
    // ?4. 'percentage'// func(x, y)
    // 4. 'bitwise'// x ^ y
    // 5. 'multiply', 'divide', 'modulo' // x * y
    // 6. 'add', 'subtract' // x + y
    // 'multiLine'// x + x... || (x + x...)/length


    // PATTERNS
    if (!arr) return '';

    if (arr.length === 1) {
        if (arr[0].type === 'numberValue') return arr[0].value.toString();
        else return '';
    }

    if (arr.length === 2) {
        // just transcription of input: [arg1] [measureUnit]
        if (arr[0].type === 'numberValue' && (arr[1].value === '%' || (arr[1].type === 'measureUnit' 
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
        if (arr[0].type === 'numberValue') {
            
            // just transcription of input: [arg1] [scale] [measureUnit] || [arg1] [area/volume identifier] [measureUnit]
            if ((arr[1].subtype === 'scale' || arr[1].subtype === 'areaIdentifier' || arr[1].subtype === 'volumeIdentifier')
                && arr[2].type === 'measureUnit') {
                return `${arr[0].value} ${arr[1].value} ${arr[2].value}`;

            // [arg1] [operation1/2/3] [arg2] percentages 'as a % of', 'as a % on', 'as a % off' 
            } else if (arr[1].subtype === 'percentage' && arr[2].type === 'numberValue') {
                if (arr[1].value === 'as a % of') { return `${(arr[0].value/arr[2].value * 100).toFixed(2)}%` }
                if (arr[1].value === 'as a % on') { return `${(arr[0].value/(arr[0].value + arr[2].value) * 100).toFixed(2)}%` }
                if (arr[1].value === 'as a % off') { return `${(arr[0].value/(arr[2].value - arr[0].value) * 100).toFixed(2)}%` }
            
            // [arg1] [operation1] [arg2] number systems conversions
            } else if (arr[1].subtype === 'conversion' && arr[2].subtype === 'numberSystem') {
                return FUNCTION_MAP[arr[2].value](+arr[0].value).toString();
            
            // simple two-operands operations [arg1] [operation] [arg2]
            } else if (arr[1].type === 'operation' && arr[2].type === 'numberValue') {
                if (arr[1].subtype === 'add' || arr[1].subtype === 'subtract' 
                    || arr[1].subtype === 'multiply' || arr[1].subtype === 'divide') {
                    return FUNCTION_MAP[arr[1].subtype](+arr[0].value, +arr[2].value).toString();
                } else if (arr[1].subtype === 'bitwise' || arr[1].subtype === 'modulo') {
                    return FUNCTION_MAP[arr[1].value](+arr[0].value, +arr[2].value).toString();
                }
            }

        // $ [arg1] [quantifier]
        } else if (arr[0].value === '$' && arr[1].type === 'numberValue' && arr[2].subtype === 'scale') {
            return `$${arr[1].value} ${arr[2].value}`;

        // [operation1] [arg1] [°] trigonometry with degrees TODO: convert
        } else if (arr[0].subtype === 'trigonometry' && arr[1].type === 'numberValue' && arr[2].value === '°') {
            return FUNCTION_MAP[arr[0].value](CONVERSIONS_MAP['degree']['radian'](+arr[1].value)).toString();
        }
        return '';
    }

    if (arr.length === 4) {
        // test exchangeCurrency prototype
        let operationsToDo = arr.filter(item => item.type === 'operation');
        if (operationsToDo.length ===1 && operationsToDo[0].subtype === 'conversion' 
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
            if (currencyFrom === currencyTo) return `${arr[0].value} ${arr[1].value}`
            if (currencyFrom === 'USD' || currencyFrom === '$') return `${(amount / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
            else if (currencyTo === 'USD') return `${(amount * exchangeRates[currencyFrom]).toFixed(2)} USD`;
            else if (currencyTo === '$') return `$${(amount * exchangeRates[currencyFrom]).toFixed(2)}`;
            else return `${(amount * exchangeRates[currencyFrom] / exchangeRates[currencyTo]).toFixed(2)} ${currencyTo}`;
            // TODO: add cases for '$', uah, dollars, $ CAD, euro etc.
        }
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
    }
    return '';
}

export const reduceParsedInput = parsedInput => {
    return parsedInput.filter(item => {
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

