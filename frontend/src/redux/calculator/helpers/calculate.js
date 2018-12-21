import { parseInput } from './parseInput';
import { FUNCTION_MAP } from './functions';
import { CONVERSIONS_MAP } from './conversions';
import { 
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST
} from './keywordsLists';
import { KEYWORDS_TYPES, KEYWORDS_SUBTYPES } from './keywordsTypes';

export const calculate = arr => (dispatch, getState) => { // type: array
    let exchangeRates = getState().calculator.exchangeRates;
    if (!arr) return '';
    const valuesArray = arr.map(item => item.value);

    // OPERATIONS PRIORITY
    // 1. braces
    // 2. 'Math', 'trigonometry', 'time'// func(x)
    // 3. 'conversion'// x * yRate
    // ?4. 'percentage'// func(x, y)
    // 4. 'bitwise'// x ^ y
    // 5. 'multiply', 'divide', 'modulo' // x * y
    // 6. 'add', 'subtract' // x + y
    // 'multiLine'// x + x... || (x + x...)/length

    // handle braces
    // TODO: braces multiplying, 2 (3) should return 6 
    if (valuesArray.indexOf('(') > -1 || valuesArray.indexOf(')') > -1) {
        let openBracePosition = valuesArray.indexOf('(');
        if (openBracePosition > -1) {
            let closingBracePosition = valuesArray.lastIndexOf(')');
            if (closingBracePosition > -1) {
                if (openBracePosition < closingBracePosition && ((closingBracePosition - openBracePosition) > 1)) { // calculating inside brackets, recursively if needed
                    let innerResult = calculate(arr.slice(openBracePosition+1, closingBracePosition))(dispatch, getState);
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

    // MATH FUNCTIONS
    valuesArray.forEach((elem, i) => {
        if (ONE_ARGUMENT_FUNCTIONS_LIST.includes(elem) || arr[i].value === 'fromunix') {
            if (arr[i+1] && arr[i+1].type === 'numberValue') {
                let innerResult = FUNCTION_MAP[arr[i].value](parseFloat(arr[i+1].value)).toString();
                if (innerResult) {
                    return calculate([
                        ...arr.slice(0, i),
                        ...parseInput(innerResult),
                        ...arr.slice(i+2)
                    ])(dispatch, getState);
                }
            }
        } else if (TRIGONOMETRY_FUNCTIONS_LIST.includes(elem) && arr[i+1] && arr[i+1].type === 'numberValue') {
            if(arr[i+2].value === '°') {
                let innerResult = FUNCTION_MAP[arr[0].value](CONVERSIONS_MAP['degree']['radian'](+arr[1].value)).toString();
                if (innerResult) {
                    return calculate([
                        ...arr.slice(0, i),
                        ...parseInput(innerResult),
                        ...arr.slice(i+3)
                    ])(dispatch, getState);
                }
            } else {
                let innerResult = FUNCTION_MAP[arr[0].value](parseFloat(arr[1].value)).toString();
                if (innerResult) {
                    return calculate([
                        ...arr.slice(0, i),
                        ...parseInput(innerResult),
                        ...arr.slice(i+2)
                    ])(dispatch, getState);
                }
            }
        }
        return '';
    });

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
                    || arr[1].subtype === 'multiply' || arr[1].subtype === 'divide' || arr[1].subtype === 'modulo') {
                    return FUNCTION_MAP[arr[1].subtype](+arr[0].value, +arr[2].value).toString();
                } else if (arr[1].subtype === 'bitwise') {
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
        if (arr[2].subtype === 'conversion' && arr[3].subtype === 'currency') {
            let amount = 0, currencyFrom, currencyTo;
            if (arr[0].type === 'numberValue' && arr[1].subtype === 'currency') {
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

        if (arr[0].type === 'numberValue' && arr[1].value === '%' && (arr[2].value === 'of what is' 
            || arr[2].value === 'on what is' || arr[2].value === 'off what is') && arr[3].type === 'numberValue') {
            if (arr[2].value === 'of what is') return `${(arr[3].value/arr[0].value * 100).toFixed(2)}`;
            if (arr[2].value === 'on what is') return `${(arr[3].value/(1 + arr[0].value/100)).toFixed(2)}`;
            if (arr[2].value === 'off what is') return `${(arr[3].value/(1 - arr[0].value/100)).toFixed(2)}`;
        }
    }

    // BITWISE FUNCTIONS
    valuesArray.forEach((elem, i) => {
        if (arr[i].subtype === 'bitwise' 
            && arr[i+1] && arr[i+1].type === 'numberValue' && arr[i-1] && arr[i-1].type === 'numberValue') {
            let innerResult = FUNCTION_MAP[arr[1].value](+arr[i-1].value, +arr[i+1].value).toString();
            if (innerResult) {
                return calculate([
                    ...arr.slice(0, i-1),
                    ...parseInput(innerResult),
                    ...arr.slice(i+2)
                ])(dispatch, getState);
            }
        }
        return '';
    });

    // MULTIPLY-DIVIDE-MODULO FUNCTIONS
    valuesArray.forEach((elem, i) => {
        if ((arr[i].subtype === 'multiply' || arr[i].subtype === 'divide' || arr[i].subtype === 'modulo') 
            && arr[i+1] && arr[i+1].type === 'numberValue' && arr[i-1] && arr[i-1].type === 'numberValue') {
            let innerResult =  FUNCTION_MAP[arr[i].subtype](+arr[i-1].value, +arr[i+1].value).toString();
            if (innerResult) {
                return calculate([
                    ...arr.slice(0, i-1),
                    ...parseInput(innerResult),
                    ...arr.slice(i+2)
                ])(dispatch, getState);
            }
        }
        return '';
    });

    // ADD-SUBTRACT FUNCTIONS
    let indexOfSimpleAdd = null;
    valuesArray.forEach((elem, i) => {
        if ((arr[i].subtype === 'add' || arr[i].subtype === 'subtract') && arr[i+1] && arr[i+1].type === 'numberValue') {
            if (arr[i-1] && arr[i-1].type === 'numberValue') indexOfSimpleAdd = i;
            else if (arr[i-2] && arr[i-2].type === 'numberValue'  && arr[i-1] && arr[i-1].type === 'measureUnit') {
                if (arr[i+2] && arr[i+2].type === 'measureUnit' && arr[i-1].subtype  === arr[i+2].subtype 
                    && arr[i-1].value  === arr[i+2].value) { // only identical units can be operated for now
                    let innerResult = `${FUNCTION_MAP[arr[i].subtype](+arr[i-2].value, +arr[i+1].value).toString()} ${arr[i-1].value}`;
                    if (innerResult) {
                        return calculate([
                            ...arr.slice(0, i-2),
                            ...parseInput(innerResult),
                            ...arr.slice(i+3)
                        ])(dispatch, getState);
                    }
                } else {
                    let innerResult = `${FUNCTION_MAP[arr[i].subtype](+arr[i-2].value, +arr[i+1].value).toString()} ${arr[i-1].value}`;
                    if (innerResult) {
                        return calculate([
                            ...arr.slice(0, i-2),
                            ...parseInput(innerResult),
                            ...arr.slice(i+2)
                        ])(dispatch, getState);
                    }
                }
            }
        }
    });
    console.log('indexOfSimpleAdd', indexOfSimpleAdd);
    if (indexOfSimpleAdd) {
        let innerResult =  FUNCTION_MAP[arr[indexOfSimpleAdd].subtype](+arr[indexOfSimpleAdd-1].value, +arr[indexOfSimpleAdd+1].value);
        if (innerResult) {
            let arrayCopy = arr.map(item => item);
    console.log(arr, arrayCopy, 'innerResult', innerResult, arrayCopy.splice(indexOfSimpleAdd-1, 3, innerResult), [
        ...arr.slice(0, indexOfSimpleAdd-1),
        parseInput(innerResult),
        ...arr.slice(indexOfSimpleAdd+2)
    ]);
            return calculate([
                ...arrayCopy.slice(0, indexOfSimpleAdd-1),
                parseInput(innerResult),
                ...arrayCopy.slice(indexOfSimpleAdd+2)
            ])(dispatch, getState);
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

