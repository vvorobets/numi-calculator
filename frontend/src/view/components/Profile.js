import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';

const Profile = (props) => {
    return (
        <>
        <div>
            <p>Your email is: <strong>{props.user.email}</strong></p><br />
            <p className="app-container__info-text">Your precious token is: <strong>{props.user.token}</strong></p><br />
        </div>
        <Link to="/edit_user_pic"> Edit Profile Picture </Link>
        </>
    )
}

Profile.propTypes = {
	user: PropTypes.shape({
		fetchingStatus: PropTypes.string,
        username: PropTypes.string,
        email: PropTypes.string,
        token: PropTypes.string
	}),
	userSignup: PropTypes.func
};

const mapStateToProps = ({ user }) => ({
	user
});

const ProfileConnected = connect(
	mapStateToProps
)(Profile);

export default ProfileConnected;