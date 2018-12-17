import { createAction } from 'redux-actions';

import types from './types';

export const updateInput = createAction(
    types.UPDATE_INPUT,
    (input, markdown) => ({ input, markdown })
);

export const updateOutput = createAction(
    types.UPDATE_OUTPUT,
    output => output
);

// this one also creates new row and cleans current input
export const calculate = createAction( 
    types.CALCULATE,
    (input, markdown, output) => ({ input, markdown, output })
);

export const deleteOne = createAction(
    types.DELETE_ONE,
    index => index
);

export const copyOne = createAction(
    types.COPY_ONE,
    updates => updates
);
  
export const refresh = createAction(
    types.REFRESH
);

export const handleError = createAction(
    types.HANDLE_ERROR,
    error => error
);

