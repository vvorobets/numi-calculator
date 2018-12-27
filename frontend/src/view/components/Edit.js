import React, { Component } from 'react';
import Avatar from 'react-avatar-edit';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { userEdit } from '../../redux/user/actions';

import FetchSpinner from './FetchSpinner';
import { image_b64toBlob } from './helpers/b64toBlob';

class RegisterForm extends Component {
    constructor(props) {
		super(props);

		this.state = {
			username: props.user.username,
			email: '',
			password: '',
			confirmPassword: '',
			selectedFile: null,
			dimensions: {},
            errors: {},

            src: './a_dd0555a0.jpg',
            preview: null
        };
        
		this.handleChange = this.handleChange.bind(this);
		this.handleSelectedFile = this.handleSelectedFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.onCrop = this.onCrop.bind(this)
        this.onClose = this.onClose.bind(this)
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSelectedFile(e) {
		this.setState({ selectedFile: URL.createObjectURL(e.target.files[0]) });
	}

	handleSubmit(e) {
        e.preventDefault();
        // TODO: some input validation
        let errors = {};
        if(Object.keys(errors).length) {
            this.setState({ errors })
        } else { 
			const { username, email, password, preview } = this.state;

			const form_data = new FormData();
			if (preview) form_data.append('profile_pic', image_b64toBlob(preview));
			form_data.append('username', username );
			this.props.userEdit(form_data);
        };
	}

	onImgLoad({target:img}) {
        this.setState({dimensions: { height: img.offsetHeight, width: img.offsetWidth }});
    }

    onClose() {
        this.setState({preview: null})
      }
      
    onCrop(preview) {
        this.setState({preview});
    }
    
    render() {
        if (this.props.user.fetchingStatus === 'suspended') {
            return (
                <FetchSpinner />
            )
        }
        
        const { username, email, password, confirmPassword, selectedFile, dimensions } = this.state;

		return (
			<form className="user-form" encType="multipart/form-data">
				<Avatar
                    width={390}
                    height={295}
                    minCropRadius={50}
                    cropRadius={50}
                    label='Pick your avatar picture'
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    src={this.state.selectedFile}
                />
                <img src={this.state.preview} alt="Preview" />
				<button onClick={this.handleSubmit} className="user-form__submit-button">Update Profile</button>
                <p className="user-form__tip--error">{ this.props.user.signupErrorMessage }</p>
			</form>
		);
	}
}

RegisterForm.propTypes = {
	user: PropTypes.shape({
		fetchingStatus: PropTypes.string,
		signupErrorMessage: PropTypes.string,
		username: PropTypes.string
	}),
	userSignup: PropTypes.func
};

const mapStateToProps = ({ user }) => ({
	user
});

const RegisterFormConnected = connect(
	mapStateToProps,
	{ userEdit }
)(RegisterForm);

export default RegisterFormConnected;
