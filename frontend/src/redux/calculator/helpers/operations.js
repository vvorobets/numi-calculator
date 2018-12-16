import { handleError } from '../actions';
import { FUNCTIONS_KEYWORDS_LIST } from './functions';
import { MULTI_LINE_OPERATIONS_LIST } from './multi-lineOperations';
import { numberSystems, scales, measureUnits, currencies } from './measureUnitsLists';
const extendedMeasureUnitsList = []; // TODO: combine scales & SI units

// TODO actions:
    // SET_VARIABLE
    // GET_VARIABLE
    // HANDLE_ERROR

export const parseInput = (input) => {
    if (input[0] === ' ') return [{ type: 'error', value: 'App does not handle trailing whitespaces for now' }];
    if (input[0] === '#') return [{ type: 'header', value: input }];
    if (input.slice(0,2) === '//') return [{ type: 'comment', value: input }];
    let currentCharType = '', currentUnit = '', parsedExpression = [];
    for (let i = 0; i < input.length; i++) {
        let x = input[i];
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
                if (input[i+1] === '=') parsedExpression.push({ type: 'error', value: 'TODO: variable' }); // handleVariable(parsedExpression, input.slice(i+2));
                else parsedExpression.push({ type: 'error', value: 'TODO: add' }); // handleAdding(input);
                break;
            case (x==='-'):
                if (input[i+1] === '=') parsedExpression.push({ type: 'error', value: 'TODO: variable' }); // handleVariable(parsedExpression, input.slice(i+2));
                else parsedExpression.push({ type: 'error', value: 'TODO: subtract' }) // handleSubtracting(input);
                break;
            case (x==='*'):
                if (input[i+1] === '=') parsedExpression.push({ type: 'error', value: 'TODO: variable' }); // handleVariable(parsedExpression, input.slice(i+2));
                else parsedExpression.push({ type: 'error', value: 'TODO: multiply' }); // handleMultiplying(input);
                break;
            case (x==='/'):
                if (input[i+1] === '/') parsedExpression.push({ type: 'error', value: 'Usage: // Line comment' }); 
                else if (input[i+1] === '=') parsedExpression.push({ type: 'error', value: 'TODO: variable' }); // handleVariable(parsedExpression, input.slice(i+2));
                else parsedExpression.push({ type: 'error', value: 'TODO: divide' }); // handleDividing(input);
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
    return parsedExpression;
}

const identifyUnit = (val) => {
    if (!isNaN(parseFloat(val))) return { type: 'numberValue', value: val };
    else if (MULTI_LINE_OPERATIONS_LIST.includes(val)) return { type: 'operation', value: val };
    else if (FUNCTIONS_KEYWORDS_LIST.includes(val)) return { type: 'operation', value: val };
    else if (numberSystems.includes(val) || scales.includes(val) || measureUnits.includes(val)
        || currencies.includes(val) || extendedMeasureUnitsList.includes(val)) {
            return { type: 'measureUnit', value: val };
    }
    return { type: 'word', value: val };
}

const checkVariableName = name => {
    if (/\d/.test(name)) { // this clause is unreachable
        console.error('first number');
        return { type: 'error', value: 'Variable name should not start with number' };
    }
console.log('name', name);
    for(let letter of name) { // underscore '_' is allowed
        if(/W/.test(letter)) {
            return { type: 'error', value: 'Variable name should not contain whitespaces or special characters'};
        }
    }
    if (MULTI_LINE_OPERATIONS_LIST.includes(name) || FUNCTIONS_KEYWORDS_LIST.includes(name)
        || numberSystems.includes(name) || scales.includes(name) || measureUnits.includes(name)
        || currencies.includes(name) || extendedMeasureUnitsList.includes(name)) {
        console.error('name is keyword'); // TODO: HANDLE_ERROR
        return { type: 'error', value: 'Keywords cannot be used as a variable' };
    } else return { type: 'variableName', value: name }; // TODO: STORE_VARIABLE && (?)SHOW_RESULT
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

