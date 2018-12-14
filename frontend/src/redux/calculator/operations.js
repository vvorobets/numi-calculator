import { handleError } from './actions';

// TODO actions:
    // SET_VARIABLE
    // GET_VARIABLE
    // HANDLE_ERROR

export const parseInput = (input) => {
    input = input.trim();
    let currentCharType = '', currentUnit = '', parsedExpression = [];
    for (let i = 0; i < input.length; i++) {
        let x = input[i];
        switch(true) {
            case /\d/.test(x):
                if (currentCharType === 'number') currentUnit = currentUnit.concat(x); // continue writing current number
                else { // start writing new number
                    if (currentUnit) { // recordind previous data
                        parsedExpression.push(currentUnit);
                        currentUnit = '';
                    };
                    if (x !== '0') currentUnit = x;
                    else if (input[i+1]==='b' || input[i+1]==='o' || input[i+1]==='x') { // for non-decimal numbers
                        currentUnit = x.concat(input[i+1]);
                        i++;
                    } else console.error('Left trailing zeros are omitted');
                }
                currentCharType = 'number'; break;
            case /[A-Za-z]/.test(x):
                if (currentCharType === 'letter') currentUnit = currentUnit.concat(x);
                else {
                    if (currentCharType) {
                        if (currentUnit) {
                            parsedExpression.push(currentUnit);
                            currentUnit = '';
                        };
                    }
                    currentUnit = x;
                }
                currentCharType = 'letter'; break;
            case (x===' '):
                if (currentUnit) {
                    parsedExpression.push(currentUnit);
                    currentUnit = '';
                };
                break;
            case (x==='='):
                if (currentUnit) parsedExpression.push(currentUnit);
                return handleVariable(parsedExpression, input.slice(i+1));
            case (x===':'):
                return `Label: input.slice(0, i)}; ${parseInput(input.slice(i+1))}`;
            case (x==='#'):
                return 'Header';
            case (x==='"'):
                let nextQuoteIndex = input.slice(i+1).indexOf('"') + i + 1;
                if (nextQuoteIndex < 0) return 'ERROR not closed quote';
                return `Comment: ${input.slice(i, nextQuoteIndex+1)}; ${parseInput(input.slice(0, i).concat(input.slice(nextQuoteIndex+1)))}`;
            case (x==='+'):
                if (input[i+1] === '=') return handleVariable(parsedExpression, input.slice(i+2));
                else return handleAdding(input);
            case (x==='-'):
                if (input[i+1] === '=') return handleVariable(parsedExpression, input.slice(i+2));
                else return handleSubtracting(input);
            case (x==='*'):
                if (input[i+1] === '=') return handleVariable(parsedExpression, input.slice(i+2));
                else return handleMultiplying(input);
            case (x==='/'):
                if (input[i+1] === '/') return 'Line comment';
                else if (input[i+1] === '=') return handleVariable(parsedExpression, input.slice(i+2));
                else return handleDividing(input);
            case (x==='.'):
                if (currentCharType === 'number') currentUnit = currentUnit.concat(x);
                else return 'Dots allowed within float point numbers only';
                break;
            case (x==='%'): 
                currentCharType = 'percentsign';
                return '//TODO Percent accounting';
            case (x==='$'): 
                currentCharType = 'dollarsign';
                return '//TODO Dollar accounting';
            default:
                continue;
        }
    }
    if (currentUnit) { // adding last element
        parsedExpression.push(currentUnit);
    };
    for(let unit of parsedExpression) {
        // TODO
    }
    return parsedExpression[0];
}

const handleVariable = (name, value) => { // name is an array
    if (name.length > 1) { 
        console.error('Variable name cannot contain whitespaces or special characters. Usage: [variableName] [+-*/]= [some expression]');
        return 'ERROR complex name'; // TODO: HANDLE_ERROR
    };
    console.log('Handling variable...', name[0], value);
    let variableName = checkVariableName(name[0].trim()), val = parseInput(value.trim());
    return `${name[0].trim()} = ${val}`; // TODO: STORE_VARIABLE && (?)SHOW_RESULT
}

const checkVariableName = (name) => {
    if (/\d/.test(name[0])) {
        console.error('first number');
        return false; // 'ERROR first number'; 'Variable name should not start with number' // TODO: HANDLE_ERROR
    }
    for(let letter of name) { // underscore '_' is allowed
        if(/W/.test(letter)) {
            return false; // 'ERROR spec char'; 'Variable name should not contain whitespaces or special characters'
        }
    }
    if (keywordsList.includes(name)) {
        console.error('name is keyword'); // TODO: HANDLE_ERROR
        return false; // 'ERROR name is keyWord'; // 'Keywords cannot be used as a variable' 
    } else return true;
}

// handle operations
const handleAdding = (input) => {
    let operands = input.split('+');
    return parseFloat(operands[0]) + parseFloat(operands[1]);
}

const handleSubtracting = (input) => {
    let operands = input.split('-');
    return operands[0] - operands[1];
}

const handleMultiplying = (input) => {
    let operands = input.split('*');
    return operands[0] * operands[1];
}

const handleDividing = (input) => {
    let operands = input.split('/');
    return operands[0] / operands[1];
}

const functionMap = {
    in: (x) => { return },
    into: (x) => { return },
    as: (x) => { return },
    to: (x) => { return },
    plus: (x, y) => { return x + y },
    and: (x, y) => { return x + y }, 
    // 'with', 
    minus: (x, y) => { return x - y }, 
    subtract: (x, y) => { return x - y }, 
    without: (x, y) => { return x - y }, 
    times: (x, y) => { return x * y }, 
    // 'multiplied by', 
    mul: (x, y) => { return x * y }, 
    divide: (x, y) => { return x / y }, 
    // 'divide by', 
    // '^', (x, y) => { return x ^ y },
    // '&', (x, y) => { return x & y },
    // '|', (x, y) => { return x | y },
    xor: (x, y) => { return x ^ y }, 
    // '<<', (x, y) => { return x << y },
    // '>>', (x, y) => { return x >> y },
    mod: (x, y) => { return x % y }, 
    fromunix: (x) => { return new Date(x) },
    hex: (x) => { return parseFloat(x).toString(16) },
    bin: (x) => { return parseFloat(x).toString(2) },
    oct: (x) => { return parseFloat(x).toString(8) },
    sci: (x) => { return parseFloat(x).toExponential(2); }, // 2 is arbitrary value and might be changed
    scientific: (x) => { return parseFloat(x).toExponential(2); },
    root: (x) => { return }, // TODO: implement
    sqrt: (x) => { return Math.sqrt(x) },
    cbrt: (x) => { return Math.cbrt(x) },
    abs: (x) => { return Math.abs(x) },
    log: (x, y) => { return Math.log2(x) }, // Returns the base 2 logarithm of a number.
    ln: (x) => { return Math.log() },
    fact: (x) => { return }, // TODO: implement
    round: (x) => { return Math.round(x) },
    ceil: (x) => { return Math.ceil(x) },
    floor: (x) => { return Math.floor(x) },
    sin: (x) => { return Math.sin(x) },
    cos: (x) => { return Math.cos(x) },
    tan: (x) => { return Math.tan(x) },
    arcsin: (x) => { return Math.asin(x) },
    arccos: (x) => { return Math.acos(x) },
    arctan: (x) => { return Math.atan(x) },
    sinh: (x) => { return Math.sinh(x) },
    cosh: (x) => { return Math.cosh(x) },
    tanh: (x) => { return Math.tanh(x) },
    // general operations
    sum: (x) => { return },
    total: (x) => { return }, 
    average: (x) => { return }, 
    avg: (x) => { return },
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

// partial function example
// function exchangeCurrency(amount, exchangeRate) {
//     return (amount*exchangeRate).toFixed(2);
// }
// const FUNCTIONS = {
//     hryvniaToDollar: exchangeCurrency.bind(null, 0.04),
// }

const keywordsList = [
    // conversion
        'in', 'into', 'as', 'to',
    // time
        'time', 'now', 'fromunix', // time ! +'in'
    // operation
        'plus', 'and', 'with', 'minus', 'subtract', 'without', 
        'times', 'multiplied by', 'mul', 'divide', 'divide by', 
        '^', '&', '|', 'xor', '<<', '>>', 'mod', 
    // number
        'hex', 'bin', 'oct', '0b', '0o', '0x', 'sci', 'scientific',
    // scales
        'k', 'thousand', 'M', 'million', 'billion', 
    // currency
        'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 
        'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD',
        'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 
        'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 
        'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 
        'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 
        'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 
        'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 
        'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 
        'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 
        'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU',
        'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW',
        'AFA', 'DASH', 'ETH', 'VTC', 'XBC', 'XBT', 'BTC', 'XLM', 'XMR', 'XRP', 'ZEC', 'BTU', // crypto currencies
    // currencies
        '$', 'Euro', 'roubles', 'hryvnias',
    // constant
        'Pi', 'E', 
    // function
        'root','sqrt','cbrt','abs','log','ln','fact','round','ceil','floor','sin','cos','tan','arcsin','arccos','arctan','sinh','cosh','tanh',
    // measure
        'px', 'em',  // CSS
        'ppi', // CSS variable
        'kelvin', 'K','celsius', 'fahrenheit', // temperature
        'm', 'meter', 'mil', 'points', 'lines', 'inch', 'hand', 'foot', 'yard', 'rod', 'chain', 'furlong', 'mile', 'cable', 'nautical mile', 'league', // length
        'hectare', 'are', 'acre', 'square', 'sq', // area
        'pint', 'quart', 'gallon', 'tea spoon', 'table spoon', 'cup', 'cubic', 'cu', 'cb', // volume
        'gram', 'tonne', 'carat', 'centner', 'pound', 'stone', 'ounce', // weight
        'radian', 'degree', '°', // angular
        'kibibytes', 'b', 'bits', 'B', 'bytes', // data  
    // measurePrefixes
        'kibi', 'Ki','mebi', 'Mi','gibi', 'Gi', // 1024
        'yotta', 'zetta', 'exa', 'peta', 'tera', 'giga', 'mega', 'kilo', 'hecto', 'deca', 
        'deci', 'centi', 'milli', 'micro', 'nano', 'pico', 'femto', 'atto', 'zepto', 'yocto', 
        'Y','Z','E','P','T','G','M','k','h','da','d','c','m','μ','n','p','f','a','z','y', // symbols
    // general
    'sum', 'total', 'average', 'avg', 
    // as variable
    'prev', 
]


