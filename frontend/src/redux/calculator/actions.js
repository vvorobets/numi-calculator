import { createAction } from 'redux-actions';

import types from './types';

import { parseInput, calculateInput } from './helpers/operations';

export const updateInput = createAction(
    types.UPDATE_INPUT,
    input => ({ input, markdown: parseInput(input) })
);

export const calculate = createAction(
    types.CALCULATE,
    input => ({ input, markdown: parseInput(input), output: calculateInput(parseInput(input)) })
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

// export const userLogout = () => dispatch => {
//     dispatch({ type: USER.LOGOUT });
// };