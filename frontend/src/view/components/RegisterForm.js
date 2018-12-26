import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { userSignup } from '../../redux/user/actions';

import FetchSpinner from './FetchSpinner';

class RegisterForm extends Component {
    constructor(props) {
		super(props);

		this.state = {
			username: '',
			email: '',
			password: '',
			confirmPassword: '',
			selectedFile: null,
			dimensions: {},
            errors: {}
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSelectedFile = this.handleSelectedFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onImgLoad = this.onImgLoad.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSelectedFile(e) {
		console.log(e.target.result, e.target.files[0]);
		this.setState({ selectedFile: URL.createObjectURL(e.target.files[0]) });
		// (event) => {this.updatePreview(event , teamLogoField)}
	}

	handleSubmit(e) {
        e.preventDefault();
        // some input validation
        let errors = {};
        let re1 = /^([a-zA-Z0-9.])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
        let re2 = /^[a-zA-Z]{2,30}$/;
        if (!re1.test(String(this.state.email).toLowerCase())) {
            errors.email = "Incorrect email format";
        }
        if (this.state.password.length <= 7) {
            errors.password = "Password must be at least 8 symbols long";
        }
        if (!re2.test(String(this.state.username).toLowerCase())) {
            errors.username = "Username must contain only letters";
        } 
        if (this.state.password !== this.state.confirmPassword) {
            errors.confirmPassword = "Confirm password is incorrect";
        }
        if(Object.keys(errors).length) {
            this.setState({ errors })
        } else { 
            const { username, email, password } = this.state;
            this.props.userSignup({ username, email, password });
        };
	}

	updatePreview(event, teamLogoField) {
		// const reader = new FileReader();
	
		// reader.onload = (e) => {
		// 	$('#team-logo-img').attr('src', e.target.result);
		//  };
	
		// reader.readAsDataURL(event.target.files[0]);
		// teamLogoField.onChange(event);
	}

	onImgLoad({target:img}) {
        this.setState({dimensions:{height:img.offsetHeight,
                                   width:img.offsetWidth}});
    }

    render() {
        if (this.props.user.username) {
            return (
                <Redirect to='/' />
            )
        }

        if (this.props.user.fetchingStatus === 'suspended') {
            return (
                <FetchSpinner />
            )
        }
        
        const { username, email, password, confirmPassword, selectedFile, dimensions } = this.state;

		return (
			<form className="user-form">
				<h3 className="user-form__header">Welcome to Numi calculator</h3>
				<input
					type="text"
					name="username"
					value={username}
					placeholder="Username"
					onChange={this.handleChange}
                    className="user-form__input"
                    autoComplete="off"
				/>
                <p className="user-form__tip--error">{ this.state.errors.username }</p>
				<input
					type="email"
					name="email"
					value={email}
					placeholder="Email"
					onChange={this.handleChange}
					autoComplete="off"
                    className="user-form__input"
				/>
                <p className="user-form__tip--error">{ this.state.errors.email }</p>
				<input
					type="password"
					name="password"
					value={password}
					placeholder="Password"
					onChange={this.handleChange}
					autoComplete="off"
                    className="user-form__input"
				/>
                <p className="user-form__tip--error">{ this.state.errors.password }</p>
				<input
					type="password"
					name="confirmPassword"
					value={confirmPassword}
					placeholder="Confirm Password"
					onChange={this.handleChange}
					autoComplete="off"
                    className="user-form__input"
				/>
                <p className="user-form__tip--error">{ this.state.errors.confirmPassword }</p>
				<p>{ selectedFile ? `Profile picture You've picked: ${selectedFile.name}, dimensions: width ${dimensions.width}, height ${dimensions.height}` : 'Pick your avatar picture' }</p>
				<img src={this.state.selectedFile} onLoad={this.onImgLoad}/>
				<input
					style={{ display: 'none' }}
					type="file"
					accept="image/png, image/jpeg, image/jpg"
					name="profilePic"
					// value={ selectedFile }
					placeholder="Upload avatar"
					onChange={this.handleSelectedFile}
					ref={ fileInput => this.fileInput = fileInput }
					autoComplete="off"
					className="user-form__input"
					required
				/>
				<button onClick={() => this.fileInput.click()}>Pick File</button>
                <p className="user-form__tip--error">{ this.state.errors.selectedFile }</p>
				<button onClick={this.handleSubmit} className="user-form__submit-button">Sign Up</button>
                <p className="user-form__tip--error">{ this.props.user.signupErrorMessage }</p>
				<span>Already Registered? </span><Link to="login"> Back to login </Link>
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
	{ userSignup }
)(RegisterForm);

export default RegisterFormConnected;
