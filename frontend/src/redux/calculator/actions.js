import { createAction } from 'redux-actions';

import types from './types';

export const updateInput = createAction(
    types.UPDATE_INPUT,
    input => input
);

export const updateOutput = createAction(
    types.UPDATE_OUTPUT,
    output => output
);

export const refresh = createAction(
    types.REFRESH
);

export const handleError = createAction(
    types.HANDLE_ERROR,
    error => error
);

export const setExchangeRates = createAction(
    types.SET_EXCHANGE_RATES,
    exchangeRates => exchangeRates
);

