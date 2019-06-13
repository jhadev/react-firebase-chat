import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Landing from './components/Landing';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import PasswordForget from './components/PasswordForget';
import Home from './components/Home';
import Account from './components/Account';
import Admin from './components/Admin';
import Container from './components/common/Container';
import { withAuthentication } from './components/Session/index';
import * as ROUTES from './constants/routes';
import './App.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <Navigation />
        <Route path={ROUTES.HOME} component={Home} />
        <Container>
          <Route exact path={ROUTES.LANDING} component={Landing} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
          <Route path={ROUTES.ACCOUNT} component={Account} />
          <Route path={ROUTES.ADMIN} component={Admin} />
        </Container>
      </Router>
    );
  }
}

export default withAuthentication(App);
