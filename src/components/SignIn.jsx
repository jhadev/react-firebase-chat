import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { SignUpLink } from "./SignUp";
import { PasswordForgetLink } from "./PasswordForget";
import { withFirebase } from "./Firebase/index";
import * as ROUTES from "../constants/routes";

const SignIn = () => {
  return (
    <div>
      <h1 className="text-center my-4">Sign In</h1>
      <SignInForm />
      <div className="row justify-content-center">
        <div className="col-md-6 col-12 mt-2">
          <PasswordForgetLink />
          <SignUpLink />
        </div>
      </div>
    </div>
  );
};

class SignInFormBase extends Component {
  state = {
    email: "",
    password: "",
    error: null
  };

  onChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;
    localStorage.setItem("email", email);

    this.props.firebase
      .doSignInUser(email, password)
      .then(() => {
        this.setState({ email: "", password: "", error: null });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div className="row justify-content-center">
        <div className="col-md-6 col-12">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                name="email"
                value={email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="password"
                value={password}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <button
              className="btn btn-primary mb-2"
              disabled={isInvalid}
              type="submit"
            >
              Sign In
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignIn;

export { SignInForm };
