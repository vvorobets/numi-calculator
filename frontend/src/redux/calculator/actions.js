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

export const saveNote = createAction(
    types.SAVE_NOTE,
    note => note
);

export const saveNoteError = createAction(
    types.SAVE_NOTE_ERROR,
);

export const saveNoteSuccess = createAction(
    types.SAVE_NOTE_SUCCESS,
);

export const fetchSaved = createAction(
    types.FETCH_SAVED,
);

export const fetchSavedError = createAction(
    types.FETCH_SAVED_ERROR,
);

export const fetchSavedSuccess = createAction(
    types.FETCH_SAVED_SUCCESS,
    notes => notes
);

export const setExchangeRates = createAction(
    types.SET_EXCHANGE_RATES,
    exchangeRates => exchangeRates
);

