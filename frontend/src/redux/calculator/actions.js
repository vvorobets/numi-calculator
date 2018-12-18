import { createAction } from 'redux-actions';

import types from './types';

export const updateInput = createAction(
    types.UPDATE_INPUT,
    (index, input, markdown) => ({ index, input, markdown })
);

export const updateOutput = createAction(
    types.UPDATE_OUTPUT,
    (index, output) => ({ index, output })
);

export const setVariable = createAction( 
    types.SET_VARIABLE,
    variable => variable
);

export const addLine = createAction( 
    types.ADD_LINE,
);

export const deleteLine = createAction(
    types.DELETE_LINE,
    index => index
);

export const refresh = createAction(
    types.REFRESH
);

export const handleError = createAction(
    types.HANDLE_ERROR,
    error => error
);

