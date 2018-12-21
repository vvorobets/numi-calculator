export const FUNCTION_GROUPS = {
    'into': [ 'in', 'into', 'as', 'to' ],
    'fromunix': [ 'fromunix' ],
    'add': [ 'plus', 'and', 'with', '+' ], 
    'subtract': [ 'minus', 'subtract', 'without', '-' ], 
    'multiply': [ 'times', 'multiplied by', 'mul', '*' ],
    'divide': [ 'divide by', '/' ],
    'mod': [ 'mod' ],
    'sci': [ 'sci', 'scientific' ],
}

export const FUNCTION_MAP = {
    in: (x) => { return },
    into: (x) => { return },
    as: (x) => { return },
    to: (x) => { return },
    add: (x, y) => { return x + y },
    subtract: (x, y) => { return x - y }, 
    multiply: (x, y) => { return x * y }, 
    divide: (x, y) => { return x / y }, 
    'xor': (x, y) => { return x ^ y }, 
    'modulo': (x, y) => { return x % y },
    '&': (x, y) => { return x & y },
    '<<': (x, y) => { return x << y },
    '>>': (x, y) => { return x >> y },
    '|': (x, y) => { return x | y },
    '^': (x, y) => { return x ^ y },
    fromunix: (x) => { return new Date(x) },
    hex: (x) => { return parseFloat(x).toString(16) },
    bin: (x) => { return parseFloat(x).toString(2) },
    oct: (x) => { return parseFloat(x).toString(8) },
    sci: (x) => { return parseFloat(x).toExponential(2); }, // 2 is arbitrary value and might be changed
    // root: (x, y) => { return }, // TODO: implement
    sqrt: (x) => { return Math.sqrt(x) },
    cbrt: (x) => { return Math.cbrt(x) },
    abs: (x) => { return Math.abs(x) },
    log: (x) => { return Math.log2(x) },
    ln: (x) => { return Math.log(x) },
    fact: (x) => { x = parseInt(x, 10);
        if (isNaN(x)) return 1;
        if (x <= 0) return 1;
        if (x > 170) return Infinity;
        let y = 1;
        for (let i = x; i>0; i--){
            y *= i;
        }
        return y;
    },
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

