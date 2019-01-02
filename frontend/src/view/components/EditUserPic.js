import React, { Component } from 'react';
import Avatar from 'react-avatar-edit';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { userEdit } from '../../redux/user/actions';

import FetchSpinner from './FetchSpinner';
import { image_b64toBlob } from './helpers/b64toBlob';

class EditUserPicForm extends Component {
    constructor(props) {
		super(props);

		this.state = {
            preview: null,
			userpicDimensions: {},
			errors: ''
        };
        
		// this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
        this.onCropPreview = this.onCropPreview.bind(this);
		this.onClosePreview = this.onClosePreview.bind(this);
		this.onLoadPreview = this.onLoadPreview.bind(this);
	}

	// handleChange(e) { this.setState({ [e.target.name]: e.target.value }); }

	// handleSelectedFile(e) { this.setState({ selectedFile: URL.createObjectURL(e.target.files[0]) }); }

	handleSubmit(e) {
        e.preventDefault();
		// TODO: some input validation
		const { preview, userpicDimensions } = this.state; // password, confirmPassword, 
		if (preview) {
			if (userpicDimensions.height > 100 || userpicDimensions.width > 100 ) {
				this.setState({ errors: 'Profile picture\'s width and height max 100px allowed' });
			} else {
				const form_data = new FormData();
				form_data.append('profile_pic', image_b64toBlob(preview));
				this.props.userEdit(form_data);
			}
		}
	}

    onClosePreview() { this.setState({ preview: null }) }
      
    onCropPreview(preview) { this.setState({preview}); }
	
	// TODO: get dimensions onCrop
	onLoadPreview({ target:img }) {
		this.setState({userpicDimensions: { height: img.offsetHeight, width: img.offsetWidth }});
	}
    
    render() {
        if (this.props.user.fetchingStatus === 'suspended') {
            return (
                <FetchSpinner />
            )
        }
        
		return (
			<form className="user-form" encType="multipart/form-data">
				<Avatar
                    width={390}
                    height={295}
                    minCropRadius={50}
                    cropRadius={50}
                    label='Pick your avatar picture'
                    onCrop={this.onCropPreview}
                    onClose={this.onClosePreview}
                />
                { this.state.preview ? <img src={this.state.preview} onLoad={this.onLoadPreview} alt="Preview" /> : ''}
				<p className="user-form__tip--error">{ this.state.errors }</p>
				<button onClick={this.handleSubmit} className="user-form__submit-button">Update Profile</button>
                <p className="user-form__tip--error">{ this.props.user.editErrorMessage }</p>
			</form>
		);
	}
}

EditUserPicForm.propTypes = {
	user: PropTypes.shape({
		fetchingStatus: PropTypes.string,
		editErrorMessage: PropTypes.string,
		username: PropTypes.string
	}),
	userSignup: PropTypes.func
};

const mapStateToProps = ({ user }) => ({
	user
});

const EditUserPicFormConnected = connect(
	mapStateToProps,
	{ userEdit }
)(EditUserPicForm);

export default EditUserPicFormConnected;
