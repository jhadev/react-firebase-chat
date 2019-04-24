import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Landing from "./components/Landing";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import PasswordForget from "./components/PasswordForget";
import Home from "./components/Home";
import Account from "./components/Account";
import Admin from "./components/Admin";
import * as ROUTES from "./constants/routes";
import "./App.css";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={Landing} />
          <Route path={ROUTES.SIGN_UP} component={SignUp} />
          <Route path={ROUTES.SIGN_IN} component={SignIn} />
          <Route path={ROUTES.PASSWORD_FORGET} component={PasswordForget} />
          <Route path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.ACCOUNT} component={Account} />
          <Route path={ROUTES.ADMIN} component={Admin} />
        </div>
      </Router>
    );
  }
}

export default App;
