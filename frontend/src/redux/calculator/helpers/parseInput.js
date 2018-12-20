import { MULTIWORD_KEYWORDS } from './keywordsLists';
import { identifyUnit } from './identifyUnit';

export const parseInput = (input) => {
console.log('input', input);
    if (input === '') return [{ type: 'error', value: 'Empty input' }];
    if (input[0] === '#') return [{ type: 'header', value: input }];
    if (input[0] === '//' && input[1] === '//') return [{ type: 'comment', value: input }];

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
                        i++;
                    } else { 
                        currentUnit = x;
                        console.error('Left trailing zeros should be omitted');
                    }
                }
                currentCharType = 'number'; 
                break;
            case /[A-Za-z]/.test(x):
                if (currentCharType === 'letter' || (currentCharType === 'number' && !isNaN(+currentUnit.concat(x)))) {
                    currentUnit = currentUnit.concat(x);
                } else {
                    if (currentUnit) parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = x;
                    currentCharType = 'letter';
                }
                break;
            case (x===' '):
                if (currentCharType === 'letter') {
                    let maybeMultiWordKeyword = false;
                    MULTIWORD_KEYWORDS.forEach(item => {
                        if (item.startsWith(currentUnit.concat(x).concat(input[i+1]))) {
                            maybeMultiWordKeyword = true;
                            return;
                        }
                    });
                    if (maybeMultiWordKeyword) {
                        currentUnit = currentUnit.concat(x);
                        break;
                    }
                }
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                parsedExpression.push({ type: 'whitespace', value: ' '});
                break;
            case (x==='='):
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                parsedExpression.push({ type: 'operation', subtype: 'assign', value: '='});
                break;
            case (/[+*/-]/.test(x)):
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                if (x === '/' && input[i+1] === '/') { 
                    parsedExpression.push({ type: 'comment', value: '//' }); 
                    parsedExpression.push({ type: 'error', value: 'Usage: // Line comment' });
                    i++;
                }
                else if (input[i+1] === '=') {
                    parsedExpression.push({ type: 'operation', subtype: 'assign', value: x.concat('=')});
                    i++;
                } else {
                    if (x==='+') parsedExpression.push({ type: 'operation', subtype: 'add', value: x });
                    else if (x==='-') parsedExpression.push({ type: 'operation', subtype: 'subtract', value: x });
                    else if (x==='*') parsedExpression.push({ type: 'operation', subtype: 'multiply', value: x });
                    else parsedExpression.push({ type: 'operation', subtype: 'divide', value: x });
                }
                break;
            case (x===':'):
                parsedExpression = [];
                parsedExpression.push({ type: 'label', value: input.slice(0, i+1) }); 
                if (currentUnit) {
                    currentUnit = '';
                    currentCharType = '';
                }
                break;
            case (x==='#'):
            if (currentUnit) {
                parsedExpression.push(identifyUnit(currentUnit));
                currentUnit = '';
                currentCharType = '';
            }
            parsedExpression.push({ type: 'error', value: 'Usage: #Header' }); 
                break;
            case (x==='"'):
                currentCharType = 'comment';
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                currentUnit = '"';
                break;
            case (x==='.'):
                if (currentCharType === 'number') currentUnit = currentUnit.concat(x);
                else parsedExpression.push({ type: 'error', value: 'Dots allowed within float point numbers only' });
                break;
            case (x==='%'): 
                if (currentCharType === 'letter') {
                    let maybeMultiWordKeyword = false;
                    MULTIWORD_KEYWORDS.forEach(item => {
                        if (item.startsWith(currentUnit.concat(x).concat(input[i+1]))) {
                            maybeMultiWordKeyword = true;
                            return;
                        }
                    });
                    if (maybeMultiWordKeyword) {
                        currentUnit = currentUnit.concat(x);
                        break;
                    }
                }
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                parsedExpression.push({ type: 'measureUnit', subtype: 'percentage', value: '%' }); 
                break;
            case (x==='$'): 
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                parsedExpression.push({ type: 'measureUnit', subtype: 'currency', value: '$' }); 
                break;
            case (/[()^&|]/.test(x)): 
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                if (x==='(' || x===')') parsedExpression.push({ type: 'operation', value: x }); 
                else parsedExpression.push({ type: 'operation', subtype: 'bitwise', value: x }); 
                break;
            case (/[<>]/.test(x)): 
                currentCharType = '';
                if (input[i+1] === x) {
                    parsedExpression.push({ type: 'operation', subtype: 'bitwise', value: x.concat(x) });
                    i++
                } else parsedExpression.push({ type: 'word', value: x });  
                break;
            case (x==='°'):
                if (currentUnit) {
                    parsedExpression.push(identifyUnit(currentUnit));
                    currentUnit = '';
                    currentCharType = '';
                }
                parsedExpression.push({ type: 'measureUnit', subtype: 'angular', value: '°' });
                break;
            default:
                continue;
        }
    }
    if (currentUnit) { // adding last element
        if (currentCharType === 'comment') parsedExpression.push({ type: 'comment', value: currentUnit });
        else parsedExpression.push(identifyUnit(currentUnit));
    };
console.log('parsedExpression: ', parsedExpression);
    return parsedExpression;
}

