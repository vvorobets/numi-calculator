export const MULTI_LINE_OPERATIONS_LIST = [ 'sum', 'total', 'average', 'avg' ];

export const CONVERSIONS_LIST = [ 'in', 'into', 'as', 'to' ]; 

export const ADD_SUBTRACT_LIST = [ '+', '-', '+=', '-=', 'plus', 'and', 'with', 'minus', 'subtract', 'without' ];

export const MULTIPLY_DIVIDE_LIST = [ 'mod', '*', '/', '*=', '/=', 'times', 'multiplied by', 'mul', 'divide by' ];

export const PERCENTAGE_LIST = [ '%', 'as a % of', 'as a % on', 'as a % off', 'of what is', 'on what is', 'off what is' ];

export const ONE_ARGUMENT_FUNCTIONS_LIST = [ 'sqrt','cbrt','abs','log','ln','fact','round','ceil','floor' ];

export const TRIGONOMETRY_FUNCTIONS_LIST = [ 'sin','cos','tan','arcsin','arccos','arctan','sinh','cosh','tanh' ];

export const TIME_FUNCTIONS_LIST = [ 'fromunix' ]; // ! + in 

export const NUMBER_SYSTEMS = [ 'hex', 'bin', 'oct', 'sci', 'scientific' ];

export const SCALES = [ 
    'thousand', 'million', 'billion', 
    // measurePrefixes
    'yotta', 'zetta', 'exa', 'peta', 'tera', 'giga', 'mega', 'kilo', 'hecto', 'deca', 
    'deci', 'centi', 'milli', 'micro', 'nano', 'pico', 'femto', 'atto', 'zepto', 'yocto',
    // symbols 
    'Y','Z','E','P','T','G','M','k','h','da','d','c','m','μ','n','p','f','a','z','y', 
    // 1024
    'kibi', 'Ki','mebi', 'Mi','gibi', 'Gi', 
];

export const MEASURE_UNITS = [
    'kelvin', 'K','celsius', 'fahrenheit', // temperature
    'm', 'meter', 'mil', 'points', 'lines', 'inch', 'hand', 'foot', 'yard', 'rod', 'chain', 'furlong', 'mile', 'cable', 'nautical mile', 'league', // length
    'meters', 'mils', 'inches', 'hands', 'feet', 'yards', 'rods', 'chains', 'furlongs', 'miles', 'cables', 'nautical miles', 'leagues', // length plural
    'hectare', 'are', 'acre', 'hectares', 'ares', 'acres', // area
    'square', 'sq', // area identifiers
    'pint', 'quart', 'gallon', 'tea spoon', 'table spoon', 'cup', // volume
    'pints', 'quarts', 'gallons', 'tea spoons', 'table spoons', 'cups', // volume plural
    'cubic', 'cu', 'cb', // volume identifiers
    'gram', 'tonne', 'carat', 'centner', 'pound', 'stone', 'ounce', // weight
    'grams', 'tonnes', 'centners', 'pounds', 'stones', 'ounces', // weight plural // ? carats
    'radian', 'degree', '°', 'radians', 'degrees', // angular
    'b', 'bits', 'bit', 'B', 'bytes', 'byte', // data
    'px', 'em',  // CSS
];

export const CURRENCIES = [
    '$', 'euro', 'euros', 'roubles', 'hryvnias', 'eur',
    // currencies
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
    // crypto currencies
    'AFA', 'DASH', 'ETH', 'VTC', 'XBC', 'XBT', 'BTC', 'XLM', 'XMR', 'XRP', 'ZEC', 'BTU', 
];

export const KEYWORDS_LIST = [ 
    ...MULTI_LINE_OPERATIONS_LIST, ...CONVERSIONS_LIST, ...ADD_SUBTRACT_LIST, ...MULTIPLY_DIVIDE_LIST, 
    ...PERCENTAGE_LIST, ...ONE_ARGUMENT_FUNCTIONS_LIST, ...TRIGONOMETRY_FUNCTIONS_LIST,
    ...TIME_FUNCTIONS_LIST, ...NUMBER_SYSTEMS, ...SCALES, ...MEASURE_UNITS, ...CURRENCIES ];

export const EXTENDED_MEASURE_UNITS_LIST = []; // TODO: combine scales & SI units

export const MULTIWORD_KEYWORDS = [ 'nautical mile', 'nautical miles', 'tea spoon', 'tea spoons', 'table spoon', 'table spoons',
    'multiplied by', 'divide by', 'as a % of', 'as a % on', 'as a % off', 'of what is', 'on what is', 'off what is' ];

    // MEASURE_UNITS DISTRUCTURED
export const TEMPERATURE_UNITS = [ 'kelvin', 'K','celsius', 'fahrenheit', ];
export const LENGTH_UNITS = [ 
    'm', 'meter', 'mil', 'points', 'lines', 'inch', 'hand', 'foot', 'yard', 'rod', 'chain', 'furlong', 'mile', 'cable', 'nautical mile', 'league',
    'meters', 'mils', 'inches', 'hands', 'feet', 'yards', 'rods', 'chains', 'furlongs', 'miles', 'cables', 'nautical miles', 'leagues'
];
export const AREA_UNITS = [ 'hectare', 'are', 'acre', 'hectares', 'ares', 'acres' ];
export const AREA_IDENTIFIERS = [ 'square', 'sq' ];
export const VOLUME_UNITS = [ 'pint', 'quart', 'gallon', 'tea spoon', 'table spoon', 'cup', 'pints', 'quarts', 'gallons', 'tea spoons', 'table spoons', 'cups' ];
export const VOLUME_IDENTIFIERS = [ 'cubic', 'cu', 'cb' ];
export const WEIGHT_UNITS = [ 'gram', 'tonne', 'carat', 'centner', 'pound', 'stone', 'ounce', 'grams', 'tonnes', 'centners', 'pounds', 'stones', 'ounces' ];
export const ANGULAR_UNITS = [ 'radian', 'degree', '°', 'radians', 'degrees' ];
export const DATA_UNITS = [ 'b', 'bits', 'bit', 'B', 'bytes', 'byte' ];
export const CSS_UNITS = [ 'px', 'em' ];

