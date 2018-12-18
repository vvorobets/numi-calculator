import { updateInput, updateOutput, handleError } from '../actions';
import { FUNCTIONS_KEYWORDS_LIST } from './functions';
import { 
    MULTI_LINE_OPERATIONS_LIST, NUMBER_SYSTEMS, SCALES, MEASURE_UNITS, CURRENCIES, 
    oneArgumentFunctionsList, twoArgumentFunctionsList, pureScalesList, extendedMeasureUnitsList, multiWordKeywords
} from './keywordsLists';

export const handleInput = (rowIndex, input) => (dispatch, getState) => {

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
                            i++; console.log('i++');
                        } else console.error('Left trailing zeros are omitted');
                    }
                    currentCharType = 'number'; break;
                case /[A-Za-z]/.test(x):
                    if (currentCharType === 'letter') currentUnit = currentUnit.concat(x);
                    else {
                        if (currentCharType) {
                            if (currentUnit) {
                                parsedExpression.push(identifyUnit(currentUnit));
                                currentUnit = '';
                            };
                        }
                        currentUnit = x;
                    }
                    if (currentCharType !== 'comment') currentCharType = 'letter'; break;
                case (x===' '):
                    if (currentUnit) {
                        parsedExpression.push(identifyUnit(currentUnit));
                        currentUnit = '';
                    };
                    parsedExpression.push({ type: 'whitespace', value: ' '});
                    break;
                case (x==='='):
                    let reducedParsedExpression = parsedExpression.filter(item => {
                        return item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'word'
                        || item.type === 'operation' || item.type === 'variableName';
                    });
                    if (reducedParsedExpression.length !==1 && reducedParsedExpression[0].type !== 'word') parsedExpression.push({ type: 'error', value: 'Usage: [varName] = [value]' });
                    else parsedExpression[parsedExpression.length-1] = checkVariableName(reducedParsedExpression[0].value);
                    parsedExpression.push({ type: 'operation', value: '='});
                    currentUnit = ''; break;
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
                case (x==='+'):
                    if (input[i+1] === '=') {
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
                        parsedExpression.push({ type: 'operation', value: '+='});
                        i++;
                    } else parsedExpression.push({ type: 'operation', value: '+' });
                    break;
                case (x==='-'):
                    if (input[i+1] === '=') {
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
                        parsedExpression.push({ type: 'operation', value: '-='});
                        i++;
                    } else parsedExpression.push({ type: 'operation', value: '-' }); // handleSubtracting(input);
                    break;
                case (x==='*'):
                    if (input[i+1] === '=') {
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
                        parsedExpression.push({ type: 'operation', value: '*='});
                        i++;
                    } else parsedExpression.push({ type: 'operation', value: '*' }); // handleMultiplying(input);
                    break;
                case (x==='/'):
                    if (input[i+1] === '/') parsedExpression.push({ type: 'error', value: 'Usage: // Line comment' }); 
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
                        parsedExpression.push({ type: 'operation', value: '+='});
                        i++;
                    } else parsedExpression.push({ type: 'operation', value: '/' }); // handleDividing(input);
                    break;
                case (x==='.'):
                    if (currentCharType === 'number') currentUnit = currentUnit.concat(x);
                    else parsedExpression.push({ type: 'error', value: 'Dots allowed within float point numbers only' });
                    break;
                case (x==='%'): 
                    currentCharType = 'percentsign';
                    parsedExpression.push({ type: 'error', value: 'TODO: Percent accounting' }); break;
                case (x==='$'): 
                    currentCharType = 'dollarsign';
                    parsedExpression.push({ type: 'measureUnit', value: '$' }); break;
                case (x==='^'): 
                    currentCharType = '';
                    parsedExpression.push({ type: 'operation', value: '^' }); break;
                case (x==='|'): 
                    currentCharType = '';
                    parsedExpression.push({ type: 'operation', value: '|' }); break;
                case (x==='&'): 
                    currentCharType = '';
                    parsedExpression.push({ type: 'operation', value: '&' }); break;
                case (x==='>'): 
                    currentCharType = '';
                    if (input[i+1] === '>') parsedExpression.push({ type: 'operation', value: '>>' });
                    else parsedExpression.push({ type: 'error', value: 'Do you mean bitwise >> ?' });  
                    break;
                case (x==='<'): 
                if (input[i+1] === '<') parsedExpression.push({ type: 'operation', value: '<<' });
                else parsedExpression.push({ type: 'error', value: 'Do you mean bitwise << ?' });  
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
console.log('calc arr: ', arr);
        let stringifiedInput = arr.map(item => item.value).join(' ');
        let testForEval = true
        let pat = /[\d+-/*|^&<>\s/]/;
        for (let n of stringifiedInput) {
            if (!pat.test(n)) testForEval = false;
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
            if (arr[0].type === 'numberValue') return arr[0].value;
            else if (arr[0].type === 'variableName') return arr[0].value; // TODO: get value
            else return '';
        }
        // handle braces
        if (arr.indexOf('(') > -1) {
            let openBracePosition = arr.indexOf('(');
            if (arr.indexOf(')') > -1) {
                let closingBracePosition = arr.indexOf(')');
                if (openBracePosition < closingBracePosition) { // calculating inside brackets, recursively if needed
                    arr = [...arr.slice(0, openBracePosition), ...parseInput(calculateInput(...arr.slice(openBracePosition+1, closingBracePosition)), ...arr.slice(closingBracePosition+1))];
                } else return '';
            } else return '';
        }
    
        let firstOperandValue = 0, firstOperandType = '', secondOperandValue = 0, secondOperandType = '', resultValue = 0, resultMeasureUnit = '', resultType = '';
        
        for(let i = 0; i < arr.length; i++) {
            if (arr[i].type === 'operation') {
                if (oneArgumentFunctionsList.includes(arr[i].value)) { // List for Math functions with pure numbers as arguments // TODO: handle radians
                    if(arr[i+1] && arr[i+1].type === 'numberValue') {
                        console.log('TODO: FUNCTIONS[arr[i].value](arr[i+1].value)');
                        firstOperandValue = 0; // TODO: FUNCTIONS[arr[i].value](arr[i+1].value);
                    }
                    if(arr[i+2] && arr[i+2].type === 'measureUnit' && pureScalesList.includes(arr[i+2].value)) { // TODO: make such list
                        firstOperandType = arr[i+2].value;
                    } else { 
                        return ''; // these functions don't work with measure units;
                    }
                } else if (twoArgumentFunctionsList.includes(arr[i].value)) { // List for Math functions with two numbers
                    if(arr[i+1] && arr[i+1].type === 'numberValue' && arr[i+2].type === 'numberValue') {
                        console.log('TODO: FUNCTIONS[arr[i].value](arr[i+1].value)');
                        firstOperandValue = 0; // FUNCTIONS[arr[i].value](arr[i+1].value, arr[i+2].value);
                    }
                    if((arr[i+2] && arr[i+2].type === 'measureUnit') && pureScalesList.includes(arr[i+2].value)) { // TODO: make such list
                        firstOperandType = arr[i+2].value;
                    } else { 
                        return ''; // these functions don't work with measure units;
                    }
                }
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
                
            }
        });
        reducedMarkdown = markdown.filter(item => {
            return (item.type === 'numberValue' || item.type === 'measureUnit' || item.type === 'variableName' 
                || item.type === 'operation'); // wipe out comments, labels etc
        });
    };
    if(errors) output = '';
    else if (reducedMarkdown) output = calculateInput(reducedMarkdown); // type: string - result value
    dispatch(updateOutput(rowIndex, output));

};

const checkVariableName = name => {
    if (/\d/.test(name)) { // this clause is unreachable
        return { type: 'error', value: 'Variable name should not start with number' };
    }
    for(let letter of name) { // underscore '_' is allowed
        if(/W/.test(letter)) {
            return { type: 'error', value: 'Variable name should not contain whitespaces or special characters'};
        }
    }
    if (MULTI_LINE_OPERATIONS_LIST.includes(name) || FUNCTIONS_KEYWORDS_LIST.includes(name)
        || NUMBER_SYSTEMS.includes(name) || SCALES.includes(name) || MEASURE_UNITS.includes(name)
        || CURRENCIES.includes(name) || extendedMeasureUnitsList.includes(name)) {
        return { type: 'error', value: 'Keywords cannot be used as a variable' };
    } else return { type: 'variableName', value: name }; // TODO: STORE_VARIABLE && (?)SHOW_RESULT
}

const identifyUnit = (val) => {
    if (!isNaN(parseFloat(val))) return { type: 'numberValue', value: val };
    else if (MULTI_LINE_OPERATIONS_LIST.includes(val)) return { type: 'operation', value: val };
    else if (FUNCTIONS_KEYWORDS_LIST.includes(val)) return { type: 'operation', value: val };
    else if (NUMBER_SYSTEMS.includes(val) || SCALES.includes(val) || MEASURE_UNITS.includes(val)
        || CURRENCIES.includes(val) || extendedMeasureUnitsList.includes(val)) {
            return { type: 'measureUnit', value: val };
    }
    return { type: 'word', value: val };
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

