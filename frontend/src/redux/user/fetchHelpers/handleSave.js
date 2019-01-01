import axios from 'axios';
import { saveNote, saveNoteError, saveNoteSuccess } from '../actions';

export const handleSave = note => (dispatch, getState) => {
    dispatch(saveNote());

    console.log('Saving...', note);

    axios({
        method: 'POST',
        url: 'http://localhost:3333/notes',
        data: JSON.stringify(note),
        headers: {
            'Authorization': `Bearer ${getState().user.token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    }).then((res) => {
	    if(res.data.message) {
            console.error(res.data.message);
            
            dispatch(saveNoteError(res.data.message));
	   	} else {
            console.log('Saved!!!');
            dispatch(saveNoteSuccess(res.data)); // , user: json.user
	    }
    });

}