import { 
    // MULTI_LINE_OPERATIONS_LIST, 
    NUMBER_SYSTEMS, SCALES, CURRENCIES, 
    CONVERSIONS_LIST, PERCENTAGE_LIST, TIME_FUNCTIONS_LIST, 
    ADD_LIST, SUBTRACT_LIST, MULTIPLY_LIST, DIVIDE_LIST,
    ONE_ARGUMENT_FUNCTIONS_LIST, TRIGONOMETRY_FUNCTIONS_LIST, BITWISE_LIST,
    TEMPERATURE_UNITS, LENGTH_UNITS, AREA_UNITS, AREA_IDENTIFIERS, VOLUME_UNITS, VOLUME_IDENTIFIERS,
    WEIGHT_UNITS, ANGULAR_UNITS, DATA_UNITS, CSS_UNITS
} from './keywordsLists';

export const identifyUnit = (val) => {
    switch(true) {
        case !isNaN(+val):
            return { type: 'numberValue', value: +val };
        // case MULTI_LINE_OPERATIONS_LIST.includes(val):
        //     return { type: 'operation', subtype: 'multiLine', value: val }; // x + x... || (x + x...)/length
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
        case ADD_LIST.includes(val):
            return { type: 'operation', subtype: 'add', value: val }; // x + y
        case SUBTRACT_LIST.includes(val):
            return { type: 'operation', subtype: 'subtract', value: val }; // x - y
        case MULTIPLY_LIST.includes(val):
            return { type: 'operation', subtype: 'multiply', value: val }; // x * y
        case DIVIDE_LIST.includes(val):
            return { type: 'operation', subtype: 'divide', value: val }; // x / y
        case val === 'mod':
            return { type: 'operation', subtype: 'modulo', value: val }; // x / y
        case BITWISE_LIST.includes(val):
            return { type: 'operation', subtype: 'bitwise', value: val }; // x ^ y
        case CURRENCIES.includes(val):
            return { type: 'measureUnit', subtype: 'currency', value: val };
        case NUMBER_SYSTEMS.includes(val):
            return { type: 'measureUnit', subtype: 'numberSystem', value: val };
        case SCALES.includes(val):
            return { type: 'measureUnit', subtype: 'scale', value: val };
        case TEMPERATURE_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'temperature', value: val };
        case LENGTH_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'length', value: val };
        case AREA_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'area', value: val };
        case AREA_IDENTIFIERS.includes(val):
            return { type: 'measureUnit', subtype: 'areaIdentifier', value: val };
        case VOLUME_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'volume', value: val };
        case VOLUME_IDENTIFIERS.includes(val):
            return { type: 'measureUnit', subtype: 'volumeIdentifier', value: val };
        case WEIGHT_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'weight', value: val };
        case ANGULAR_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'angular', value: val };
        case DATA_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'data', value: val };
        case CSS_UNITS.includes(val):
            return { type: 'measureUnit', subtype: 'css', value: val };
        default:
            return { type: 'word', value: val };
    }
}

