import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

import RegisterForm from './view/components/RegisterForm';
import LoginForm from './view/components/LoginForm';
import Dashboard from './view/components/Dashboard';

export default class Router extends Component {
	render() {
		return (
			<Switch>
				<Route exact path="/login" component={ LoginForm } />
				<Route exact path="/register" component={ RegisterForm } />
				<Route component={ Dashboard } />
			</Switch>
		)
	}
}
