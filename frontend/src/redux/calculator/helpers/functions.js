export const FUNCTIONS_KEYWORDS_LIST = [
    // conversion
    'in', 'into', 'as', 'to',
    // time // ! + in
    'fromunix',
    // operations
    'plus', 'and', 'with', 'minus', 'subtract', 'without', 
    'times', 'multiplied by', 'mul', 'divide', 'divide by', 
    'mod',  // '^', '&', '|', 'xor', '<<', '>>', - to be handled by eval()
    // number
    'sci', 'scientific',
    // Math functions
    'root','sqrt','cbrt','abs','log','ln','fact','round','ceil','floor',
    'sin','cos','tan','arcsin','arccos','arctan','sinh','cosh','tanh',
]

export const FUNCTION_GROUPS = {
    'into': [ 'in', 'into', 'as', 'to' ],
    'fromunix': [ 'fromunix' ],
    'plus': [ 'plus', 'and', 'with', '+' ], 
    'minus': [ 'minus', 'subtract', 'without', '-' ], 
    'multiply': [ 'times', 'multiplied by', 'mul', '*' ],
    'divide': [ 'divide', 'divide by', '/' ],
    'mod': [ 'mod' ],
    'sci': [ 'sci', 'scientific' ],
}

export const functionMap = {
    in: (x) => { return },
    into: (x) => { return },
    as: (x) => { return },
    to: (x) => { return },
    plus: (x, y) => { return x + y },
    minus: (x, y) => { return x - y }, 
    times: (x, y) => { return x * y }, 
    divide: (x, y) => { return x / y }, 
    xor: (x, y) => { return x ^ y }, 
    mod: (x, y) => { return x % y }, 
    fromunix: (x) => { return new Date(x) },
    hex: (x) => { return parseFloat(x).toString(16) },
    bin: (x) => { return parseFloat(x).toString(2) },
    oct: (x) => { return parseFloat(x).toString(8) },
    sci: (x) => { return parseFloat(x).toExponential(2); }, // 2 is arbitrary value and might be changed
    // root: (x) => { return }, // TODO: implement
    sqrt: (x) => { return Math.sqrt(x) },
    cbrt: (x) => { return Math.cbrt(x) },
    abs: (x) => { return Math.abs(x) },
    log: (x) => { return Math.log2(x) },
    ln: (x) => { return Math.log(x) },
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

