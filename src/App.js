import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PasswordForget from './pages/PasswordForget';
import Home from './pages/Home';
import DirectMessages from './pages/DirectMessages';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Container from './components/common/Container';
import { withAuthentication } from './components/Session/index';
import * as ROUTES from './constants/routes';
import './App.scss';

const App = () => (
  <Router>
    <Navigation />
    <Route path={ROUTES.HOME} component={Home} />
    <Route path={ROUTES.DMS} component={DirectMessages} />
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

export default withAuthentication(App);
