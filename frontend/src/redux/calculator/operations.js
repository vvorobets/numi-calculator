import { handleError } from './actions';

export const parseInput = (input) => {
    input = input.trim();
    let currentCharType = '';
    let parsedExpression = [];
    let currentUnit = '';
    for (let i = 0; i < input.length; i++) {
        let x = input[i];
        switch(true) {
            case /\d/.test(x):
                if (currentCharType === 'number') {
                    currentUnit = currentUnit.concat(x);
                } else {
                    if (currentCharType) parsedExpression.push(currentUnit);
                    if (x !== '0') {
                        currentUnit = x;
                    } else console.log('Left trailing zeros are omitted');
                }
                currentCharType = 'number'; break;
            case /[A-Za-z]/.test(x):
                if (currentCharType === 'letter') {
                    currentUnit = currentUnit.concat(x);
                } else {
                    if (currentCharType) parsedExpression.push(currentUnit);
                    currentUnit = x;
                }
                currentCharType = 'letter'; break;
            case (x===' '):
                if (currentCharType === 'letter' && /[A-Za-z]/.test(input[i+1])) {
                    currentUnit = currentUnit.concat(x);
                } else currentCharType = 'whitespace';
                break;
            case (x==='='): 
                handleVariable(input); break;
            case (x===':'):
                return parseInput(input.slice(i+1));
            case (x==='#'):
                return 'Header';
            case (x==='"'):
                return handleQuoteComment(input);
            case (x==='+'):
                if (input[i+1] === '=') {
                    return handleVariable(input);
                } else return handleAdding(input);
            case (x==='-'):
                if (input[i+1] === '=') {
                    return handleVariable(input);
                } else return handleSubtracting(input);
            case (x==='*'):
                if (input[i+1] === '=') {
                    return handleVariable(input);
                } else return handleMultiplying(input);
            case (x==='/'):
                if (input[i+1] === '/') {
                    return 'Line comment';
                } else if (input[i+1] === '=') {
                    return handleVariable(input);
                } else return handleDividing(input);
            case (x==='.'):
                if (currentCharType === 'number') {
                    currentUnit = currentUnit.concat(x);
                } else {
                    return 'Dots allowed within float point numbers only';
                }
            case (x==='%'): 
                currentCharType = 'percentsign';
                return '//TODO Percent accounting'; break;
            case (x==='$'): 
                currentCharType = 'dollarsign';
                return '//TODO Dollar accounting'; break;
            default:
                console.log('Not found');
        }
    }
    parsedExpression.push(currentUnit);
    for(let unit of parsedExpression) {
        console.log(unit, keywordsList.includes(unit))
    }
    return input.length;
}

const handleVariable = (input) => {
    let operands = input.split('=');
    if(operands.length > 2) {
        console.log('Transitive variable declaration is unsupported for now'); // or calculate recursively
        return;
    };
    let variable = operands[0];
    if(variable[variable.length - 1] === '+') { // to get variable from store
        handleAdding();
    }
    return 'Variable';
}

// handle operations
const handleAdding = (input) => {
    let operands = input.split('+');
    return operands[0] + operands[1]; // !concatenation
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

// handle format
const handleLabel = (input) => {
    let operands = input.split(':');
    if(operands.length > 2) {
        return 'Multiple labeling is unsupported for now'; // as alternative might be just recursively slice next label
    };
    return 'Label, ' + parseInput(operands[1]);
}

const handleQuoteComment = () => {
    return 'QuoteComment';
}

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
        '$', 'Euro', 
    // constant
        'Pi', 'E',
    // function
        'root','sqrt','cbrt','abs','log','ln','fact','round','ceil','floor','sin','cos','tan','arcsin','arccos','arctan','sinh','cosh','tanh',
    // measure
        'px', 'em', 'ppi', // CSS
        'kelvin', 'K','celsius', 'fahrenheit', // temperature
        'meter', 'mil', 'points', 'lines', 'inch', 'hand', 'foot', 'yard', 'rod', 'chain', 'furlong', 'mile', 'cable', 'nautical mile', 'league', // length
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
    'prev', 'sum', 'total', 'average', 'avg', 
]


