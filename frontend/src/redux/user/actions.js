import { createAction } from 'redux-actions';
import axios from 'axios';
import { types } from './types';

export const userSignup = (user) => dispatch => {
    dispatch({ type: types.SIGNUP});

    return fetch('http://localhost:3333/registration', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(json => { 
            if (json.type === 'error') {
                dispatch({ 
                    type: types.SIGNUP_ERROR,
                    message: json.message
                });
            } else {
                dispatch({ 
                    type: types.SIGNUP_SUCCESS,
                    user: json.user
                });
            }
        })            
        .catch(error => {
            dispatch({ 
                type: types.SIGNUP_ERROR,
                message: error.message
            });
        });
};

export const userEdit = form_data => (dispatch, getState) => {
    dispatch({ type: types.EDIT});

    axios({
        method: 'POST',
        url: 'http://localhost:3333/edit',
        data: form_data,
        headers: {
            'Authorization': `Bearer ${getState().user.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((res) => {
console.log('Edit res: ', res);
	    if(res.data.message) {
            console.error(res.data.message);
            dispatch({ type: types.EDIT_ERROR, payload: { message: res.data.message }});
	   	} else {
            console.log('Image has been uploaded successfully');
            dispatch({ type: types.EDIT_SUCCESS, payload: res.data });
	    }
    });
    // return fetch('http://localhost:3333/edit', {
    //     method: "POST",
    //     mode: "cors",
    //     headers: {
    //         "Content-Type": undefined,
            
    //     },
    //     body: user
    // })
    //     .then(response => response.json())
    //     .then(json => { 
    //         if (json.type === 'error') {
    //             dispatch({ 
    //                 type: USER.EDIT_ERROR,
    //                 message: json.message
    //             });
    //         } else {
    //             dispatch({ 
    //                 type: USER.EDIT_SUCCESS,
    //                 user: json.user
    //             });
    //         }
    //     })            
    //     .catch(error => {
    //         dispatch({ 
    //             type: USER.EDIT_ERROR,
    //             message: error.message
    //         });
    //     });
};

export const userLogin = (user) => dispatch => {
    dispatch({ type: types.LOGIN });

    return fetch('http://localhost:3333/login', {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(user),
    })
        .then(response => response.json())
        .then(json => {
            if (json.type === 'error') {
                dispatch({ 
                    type: types.LOGIN_ERROR,
                    message: json.message
                });
            } else if (json[0]) { // need to be refactored with proper response messaging from server
                dispatch({ 
                    type: types.LOGIN_ERROR,
                    message: json[0].message
                });
            } else {
                dispatch({ 
                    type: types.LOGIN_SUCCESS,
                    user: json.user
                });
            }
        })            
        .catch(error => {
            console.error(error);
            dispatch({ 
                type: types.LOGIN_ERROR,
                message: error.message
            });
        });
};

export const userLogout = () => dispatch => {
    dispatch({ type: types.LOGOUT });

    return fetch('http://localhost:3333/logout', {
        method: "GET",
        mode: "cors"
     })
        .then(response => response.json())
        .then(json => { 
            if (json.type === 'error') {
                console.error(json.message);
             } else if (json[0]) {
                console.error(json[0].message);
            } else {
                console.log(json); 
            };
        })            
        .catch(error => {
            console.error(error.message);
        });
};

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

