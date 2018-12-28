import axios from 'axios';
import { updateInput, updateOutput, saveNote } from '../actions';

export const handleSave = note => (dispatch, getState) => {

    console.log('Saving...', note);

    // axios({
    //     method: 'POST',
    //     url: 'http://localhost:3333/notes',
    //     data: form_data,
    //     headers: {
    //         'Authorization': `Bearer ${getState().user.token}`,
    //         'Content-Type': 'application/json'
    //     }
    // }).then((res) => {
	//     if(res.data.message) {
    //         console.error(res.data.message);
            
    //         dispatch({ type: USER.EDIT_ERROR, message: res.data.message });
	//    	} else {
    //         console.log('Image has been uploaded successfully');
    //         dispatch({ type: USER.EDIT_SUCCESS }); // , user: json.user
	//     }
    // });

}