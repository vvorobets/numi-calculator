import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { userLogout } from '../../redux/user/actions';

class Home extends Component {
    constructor(props) {
        super(props);

        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.userLogout();
    }

    render() {
        if (!this.props.user.username) {
            return(
                <Redirect to='/login' />
            )
        }
        return(
            <div className="user-form">
                <h3 className="user-form__header">Welcome, {this.props.user.username}!</h3><br />
                <p>This is the very Home component</p><br />
                <p>Your email is: <strong>{this.props.user.email}</strong></p><br />
                <button onClick={this.handleLogout} className="user-form__submit-button">Log Out</button>
            </div>
        )
    }
}

const mapStateToProps = ({ user }) => ({
	user
});

const HomeConnected = connect(
	mapStateToProps,
	{ userLogout }
)(Home);

export default HomeConnected;