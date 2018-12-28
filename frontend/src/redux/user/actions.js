import axios from 'axios';
import { USER } from './types';

export const userSignup = (user) => dispatch => {
    dispatch({ type: USER.SIGNUP});

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
                    type: USER.SIGNUP_ERROR,
                    message: json.message
                });
            } else {
                dispatch({ 
                    type: USER.SIGNUP_SUCCESS,
                    user: json.user
                });
            }
        })            
        .catch(error => {
            dispatch({ 
                type: USER.SIGNUP_ERROR,
                message: error.message
            });
        });
};

export const userEdit = form_data => (dispatch, getState) => {
    dispatch({ type: USER.EDIT});

    console.log('Body: ', form_data);

    axios({
        method: 'POST',
        url: 'http://localhost:3333/edit',
        data: form_data,
        headers: {
            'Authorization': `Bearer ${getState().user.token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then((res) => {
	    if(res.data.message) {
            console.error(res.data.message);
            
            dispatch({ type: USER.EDIT_ERROR, message: res.data.message });
	   	} else {
            console.log('Image has been uploaded successfully');
            dispatch({ type: USER.EDIT_SUCCESS }); // , user: json.user
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
    dispatch({ type: USER.LOGIN });

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
                    type: USER.LOGIN_ERROR,
                    message: json.message
                });
            } else if (json[0]) { // need to be refactored with proper response messaging from server
                dispatch({ 
                    type: USER.LOGIN_ERROR,
                    message: json[0].message
                });
            } else {
                dispatch({ 
                    type: USER.LOGIN_SUCCESS,
                    user: json.user
                });
            }
        })            
        .catch(error => {
            console.error(error);
            dispatch({ 
                type: USER.LOGIN_ERROR,
                message: error.message
            });
        });
};

export const userLogout = () => dispatch => {
    dispatch({ type: USER.LOGOUT });

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
