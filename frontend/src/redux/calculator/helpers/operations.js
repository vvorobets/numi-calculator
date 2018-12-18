import { updateInput, updateOutput, setVariable, handleError } from '../actions';
import { FUNCTION_MAP } from './functions';
import { 
    MULTI_LINE_OPERATIONS_LIST, NUMBER_SYSTEMS, SCALES, MEASURE_UNITS, CURRENCIES, 
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST,
    CONVERSIONS_LIST, PERCENTAGE_LIST, TIME_FUNCTIONS_LIST, ADD_SUBTRACT_LIST, MULTIPLY_DIVIDE_LIST, 
    KEYWORDS_LIST, extendedMeasureUnitsList, MULTIWORD_KEYWORDS
} from './keywordsLists';

let variables = [], VARIABLES_LIST = [], exchangeRates = {};

export const handleInput = (rowIndex, input) => (dispatch, getState) => {

    variables = getState().calculator.variables;
    VARIABLES_LIST = Object.keys(variables);
    exchangeRates = getState().calculator.exchangeRates;

    const markdown = parseInput(input); // type: array of parsed input's elements
    dispatch(updateInput(rowIndex, input, markdown));

    let errors = 0, output, reducedMarkdown = [];
    if (markdown) {
        markdown.forEach(item => {
            if(item.type === 'error')  {
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
    else if (reducedMarkdown) output = calculateInput(reducedMarkdown); // type: string - result value
    dispatch(updateOutput(rowIndex, output));

};

const parseInput = (input) => {
    if (input[0] === '') return [{ type: 'error', value: 'Empty input' }];
    if (input[0] === '#') return [{ type: 'header', value: input }];
    if (input.slice(0,2) === '//') return [{ type: 'comment', value: input }];

    let currentCharType = '', currentUnit = '', parsedExpression = [];

    for (let i = 0; i < input.length; i++) {
        let x = input[i];
console.log('x is: ', x);
        if (currentCharType === 'comment') {
            currentUnit += x; 
            if (x === '"') {
                parsedExpression.push({ type: 'comment', value: currentUnit });
                currentCharType = ''
                currentUnit = '';
            }
            continue;
        };

        switch(true) {
            case /\d/.test(x):
                if (currentCharType === 'number') currentUnit = currentUnit.concat(x); // continue writing current number
                else { // start writing new number
                    if (currentUnit) { // recordind previous data
                        parsedExpression.push(identifyUnit(currentUnit));
                        currentUnit = '';
                    };
                    if (x !== '0') currentUnit = x;
                    else if (input[i+1]==='b' || input[i+1]==='o' || input[i+1]==='x') { // for non-decimal: '0b', '0o', '0x'
                        currentUnit = x.concat(input[i+1]);
                        i++;
                    } else { 
                        currentUnit = x;
                        console.error('Left trailing zeros should be omitted');
                    }
                }
                currentCharType = 'number'; break;
            case /[A-Za-z]/.test(x):
                if (currentCharType === 'letter') currentUnit = currentUnit.concat(x);
                else {
                    if (currentUnit) parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = x;
                    currentCharType = 'letter';
                }
                break;
            case (x===' '):
                if (currentUnit) {
                    if (MULTIWORD_KEYWORDS.includes(currentUnit)) {
                        parsedExpression.push({ type: 'operation', value: currentUnit });
                        currentUnit = '';
                    }
                    let isMultiWordKeyword = false;
                    MULTIWORD_KEYWORDS.forEach(item => {
                        if (item.startsWith(currentUnit)) {
                            isMultiWordKeyword = true;
                            return;
                        }
                    });
                    if (isMultiWordKeyword) {
                        currentUnit = currentUnit.concat(x);
                        break;
                    } else {
                        parsedExpression.push(identifyUnit(currentUnit));
                        currentUnit = '';
                    }
                };
                parsedExpression.push({ type: 'whitespace', value: ' '});
                break;
            case (x==='='):
                if (currentUnit) parsedExpression.push(identifyUnit(currentUnit));
                let reducedParsedExpression = parsedExpression.filter(item => {
                    return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
                    || item.type === 'operation' || item.type === 'variableName';
                });
                if (reducedParsedExpression.length !==1 && reducedParsedExpression[0].type !== 'word') parsedExpression.push({ type: 'error', value: 'Usage: [varName] = [value]' });
                else {
                    let varIndex;
                    parsedExpression.forEach((item, i) => {
                        if (item.type === 'word') {
                            varIndex = i; 
                        }
                    });
                    parsedExpression[varIndex] = checkVariableName(reducedParsedExpression[0].value);
                }
                parsedExpression.push({ type: 'operation', value: '='});
                currentCharType = '';
                currentUnit = ''; 
                break;
            case (x===':'):
                parsedExpression = [];
                parsedExpression.push({ type: 'label', value: input.slice(0, i+1) }); 
                currentUnit = ''; break;
            case (x==='#'):
                if (currentUnit) parsedExpression.push(identifyUnit(currentUnit));
                parsedExpression.push({ type: 'error', value: 'Usage: #Header' }); break;
            case (x==='"'):
                currentCharType = 'comment';
                if (currentUnit) parsedExpression.push(identifyUnit(currentUnit));
                currentUnit = '"';
                break;
            case (/[+*/-]/.test(x)):
                if (x === '/' && input[i+1] === '/') { 
                    parsedExpression.push({ type: 'comment', value: '//' }); 
                    parsedExpression.push({ type: 'error', value: 'Usage: // Line comment' });
                    i++;
                }
                else if (input[i+1] === '=') {
                    if (currentUnit) {
                        parsedExpression.push(identifyUnit(currentUnit));
                        currentUnit = '';
                    }
                    let reducedParsedExpression = parsedExpression.filter(item => {
                        return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
                        || item.type === 'operation' || item.type === 'variableName';
                    });
                    if (reducedParsedExpression.length !==1 && reducedParsedExpression[0].type !== 'word') parsedExpression.push({ type: 'error', value: 'Usage: [varName] = [value]' });
                    else parsedExpression[parsedExpression.length-1] = checkVariableName(reducedParsedExpression[0].value);
                    parsedExpression.push({ type: 'operation', value: x.concat('=')});
                    i++;
                } else {
                    if (currentUnit) {
                        parsedExpression.push(identifyUnit(currentUnit));
                        currentUnit = '';
                    }
                    parsedExpression.push({ type: 'operation', value: x });
                }
                currentCharType = '';
                break;
            case (x==='.'):
                if (currentCharType === 'number') currentUnit = currentUnit.concat(x);
                else parsedExpression.push({ type: 'error', value: 'Dots allowed within float point numbers only' });
                break;
            case (/[%$]/.test(x)): 
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                }
                if (currentCharType) currentCharType = '';
                parsedExpression.push({ type: 'measureUnit', value: x }); 
                break;
            case (/[()^&|]/.test(x)): 
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                }
                currentCharType = '';
                parsedExpression.push({ type: 'operation', value: x }); 
                break;
            case (/[<>]/.test(x)): 
                currentCharType = '';
                if (input[i+1] === x) {
                    parsedExpression.push({ type: 'operation', value: x.concat(x) });
                    i++
                } else parsedExpression.push({ type: 'word', value: x });  
                break;
            default:
                continue;
        }
    }
    if (currentUnit) { // adding last element
        if (currentCharType === 'comment') parsedExpression.push({ type: 'comment', value: currentUnit });
        else parsedExpression.push(identifyUnit(currentUnit));
    };
    console.log('parsedExpression', parsedExpression);
    return parsedExpression;
}



const calculateInput = arr => { // type: array
    
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
                    return calculateInput([...arr.slice(0, openBracePosition), ...parseInput(calculateInput(...arr.slice(openBracePosition+1, closingBracePosition)), ...arr.slice(closingBracePosition+1))]);
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
                    return calculateInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)])
                } else return '';
            } else if (TRIGONOMETRY_FUNCTIONS_LIST.includes(arr[i].value)) {
                if(arr[i+1] && arr[i+1].type === 'numberValue') {
                    if(arr[i+2] && arr[i+2].value === '°') {
                        console.error('Not implemented for now');
                        // TODO: convert
                        return calculateInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+3)])
                    }
                    return calculateInput([{ type: 'numberValue', value: FUNCTION_MAP[arr[i].value](arr[i+1].value) }, ...arr.slice(i+2)]);
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



const checkVariableName = name => {
    if (/\d/.test(name)) { // this clause is unreachable
        return { type: 'error', value: 'Variable name should not start with number' };
    }
    for(let letter of name) { // underscore '_' is allowed
        if(/W/.test(letter)) {
            return { type: 'error', value: 'Variable name should not contain whitespaces or special characters'};
        }
    }
    if (KEYWORDS_LIST.includes(name)) {
        return { type: 'error', value: 'Keywords cannot be used as a variable' };
    } else return { type: 'variableName', value: name }; // TODO: STORE_VARIABLE
}

const identifyUnit = (val) => {
    switch(true) {
        case !isNaN(parseFloat(val)):
            return { type: 'numberValue', value: val };
        case VARIABLES_LIST.includes(val):
            return { type: 'operation', subtype: 'variable', value: val }; // pattern: func(x)
        case MULTI_LINE_OPERATIONS_LIST.includes(val):
            return { type: 'operation', subtype: 'multiLine', value: val }; // x + x... || (x + x...)/length
        case ONE_ARGUMENT_FUNCTIONS_LIST.includes(val):
            return { type: 'operation', subtype: 'Math', value: val }; // func(x)
        case TRIGONOMETRY_FUNCTIONS_LIST.includes(val):
            return { type: 'operation', subtype: 'trigonometry', value: val }; // func(x) || func(convertToX(y))
        case CONVERSIONS_LIST.includes(val):
            return { type: 'operation', subtype: 'conversion', value: val }; // x * yRate
        case PERCENTAGE_LIST.includes(val):
            return { type: 'operation', subtype: 'percentage', value: val }; // func(x, y)
        case TIME_FUNCTIONS_LIST.includes(val):
            return { type: 'operation', subtype: 'time', value: val }; // func(x)
        case ADD_SUBTRACT_LIST.includes(val):
            return { type: 'operation', subtype: 'add-subtract', value: val }; // x + y
        case MULTIPLY_DIVIDE_LIST.includes(val):
            return { type: 'operation', subtype: 'multiply-divide', value: val }; // x * y
        case CURRENCIES.includes(val):
            return { type: 'measureUnit', subtype: 'currency', value: val };
        case NUMBER_SYSTEMS.includes(val):
            return { type: 'measureUnit', subtype: 'numberSystem', value: val };
        case SCALES.includes(val):
            return { type: 'measureUnit', subtype: 'scale', value: val };
        case MEASURE_UNITS.includes(val):
        case extendedMeasureUnitsList.includes(val):
            return { type: 'measureUnit', value: val };
        default:
            return { type: 'word', value: val };
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

