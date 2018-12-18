// partial function example
// function exchangeCurrency(amount, exchangeRate) {
//     return (amount*exchangeRate).toFixed(2);
// }

const CONVERSIONS = {
    kelvinToCelcius: amount => { return (amount - 273.15).toFixed(2); },
    kelvinToFahrenheit: amount => { return (amount * 1.8 - 459.67).toFixed(2); },
    celsiusToKelvin: amount => { return (amount + 273.15).toFixed(2); },
    celsiusToFahrenheit: amount => { return (amount * 1.8 + 32).toFixed(2); },
    fahrenheitToCelcius: amount => { return ((amount - 32) * 5 / 9).toFixed(2); },
    fahrenheitToKelvin: amount => { return ((amount + 459.67) * 5 / 9).toFixed(2); },

    meterToMile,
    // 1 radian = 57.2957795 degrees
    // 1 degrees = 0.0174532925 radians
    hryvniaToDollar: exchangeCurrency.bind(null, 0.04),
}

const conversion = {
    K: amount => { return (amount*exchangeRate).toFixed(2); },

}

// 'kelvin', 'K','celsius', 'fahrenheit', // temperature
// 'm', 'meter', 'mil', 'points', 'lines', 'inch', 'hand', 'foot', 'yard', 'rod', 'chain', 'furlong', 'mile', 'cable', 'nautical mile', 'league', // length
// 'meters', 'mils', 'inches', 'hands', 'feet', 'yards', 'rods', 'chains', 'furlongs', 'miles', 'cables', 'nautical miles', 'leagues', // length plural
// 'hectare', 'are', 'acre', 'hectares', 'ares', 'acres', // area
// 'square', 'sq', // area identifiers
// 'pint', 'quart', 'gallon', 'tea spoon', 'table spoon', 'cup', // volume
// 'pints', 'quarts', 'gallons', 'tea spoons', 'table spoons', 'cups', // volume plural
// 'cubic', 'cu', 'cb', // volume identifiers
// 'gram', 'tonne', 'carat', 'centner', 'pound', 'stone', 'ounce', // weight
// 'grams', 'tonnes', 'centners', 'pounds', 'stones', 'ounces', // weight plural // ? carats
// 'radian', 'degree', '°', 'radians', 'degrees', // angular
// 'b', 'bits', 'bit', 'B', 'bytes', 'byte', // data
// 'px', 'em',  // CSS

