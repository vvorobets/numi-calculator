import React, { Component } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

// redux
import { connect } from 'react-redux';
import { userLogout } from '../../redux/user/actions';
import { getExchangeRates } from '../../redux/calculator/helpers/getExchangeRates';

// React components
import Quickstart from './Quickstart';
import Profile from './Profile';
import EditUserPic from './EditUserPic';
import Calculator from './calculator/Calculator';
import Home from './Home';

const userpicPath = `http://localhost:3333/tmp/uploads/`;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        this.props.getExchangeRates();
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
            <div className="app-container">
                <div className="user-navbar">
                    <Link to="/home" className="user-navbar__link" >Home</Link>
                    <Link to="/quickstart" className="user-navbar__link" >Quickstart</Link>
                    <Link to="/calculator" className="user-navbar__link" >Calculator</Link>
                    <Link to="/profile" className="user-navbar__link" >Profile</Link>
                    <button onClick={this.handleLogout} className="user-form__submit-button user-form__submit-button--logout">Log Out</button>
                </div>
                <div className="app-container__main-section">
                    <h3 className="app-container__header">Welcome, {this.props.user.username}!
                        <img src={`${userpicPath}${this.props.user.userpic}`} alt="userpic" />
                    </h3><br />
                <Switch>
                    <Route exact path="/quickstart" component={ Quickstart } />
                    <Route exact path="/calculator" component={ Calculator } />
                    <Route exact path="/profile" component={ Profile } />
                    <Route exact path="/edit_user_pic" component={ EditUserPic } />
                    <Route component={ Home } />
                </Switch>
                </div>
            </div>
        )
    }
}

Dashboard.propTypes = {
	user: PropTypes.shape({
        username: PropTypes.string,
        userpic: PropTypes.string
    }),
    userLogout: PropTypes.func,
    getExchangeRates: PropTypes.func
};

const mapStateToProps = ({ user }) => ({
	user
});

const DashboardConnected = connect(
	mapStateToProps,
	{ userLogout, getExchangeRates }
)(Dashboard);

export default DashboardConnected;