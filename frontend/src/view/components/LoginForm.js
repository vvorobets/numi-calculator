import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { userLogin } from '../../redux/user/actions';

import FetchSpinner from './FetchSpinner';

class LoginForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}

	handleSubmit(e) {
        e.preventDefault();
        const { username, password } = this.state;
		this.props.userLogin({ username, password });
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
        
		return (
			<form className="user-form">
				<h3 className="user-form__header">Sign in or else!</h3>
				<input
					type="username"
					name="username"
					placeholder="Username"
					autoComplete="off"
					value={this.state.username}
					onChange={this.handleChange}
                    className="user-form__input"
				/>
                <br />
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={this.state.password}
					onChange={this.handleChange}
                    className="user-form__input"
				/>
				{this.props.loginStatus === 'failed' && (
					<span className="user-form__tip--error">Username or password is incorrect</span>
				)}
                <p className="user-form__tip--error">{ this.props.user.loginErrorMessage }</p>
                <button onClick={this.handleSubmit} className="user-form__submit-button">Sign In</button>
                <br />
                <span>Not registered yet? </span><Link to="register">Create an account</Link>
			</form>
		);
	}
}

const mapStateToProps = ({ user }) => ({
	user
});

const LoginFormConnected = connect(
	mapStateToProps,
	{ userLogin }
)(LoginForm);

export default LoginFormConnected;
