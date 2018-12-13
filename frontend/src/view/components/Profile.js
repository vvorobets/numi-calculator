import React from 'react';

// redux
import { connect } from 'react-redux';

const Profile = (props) => {
    return (
        <React.Fragment>
        <div>
            <p>Your email is: <strong>{props.user.email}</strong></p><br />
            <p className="app-container__info-text">Your precious token is: <strong>{props.user.token}</strong></p><br />
        </div>
        </React.Fragment>
    )
}

const mapStateToProps = ({ user }) => ({
	user
});

const ProfileConnected = connect(
	mapStateToProps
)(Profile);

export default ProfileConnected;