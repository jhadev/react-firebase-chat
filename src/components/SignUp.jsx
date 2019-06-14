import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from './Firebase/index';
import * as ROUTES from '../constants/routes';
import Row from './common/Row';
import Column from './common/Column';

const SignUp = () => {
  return (
    <div>
      <h1 className="text-center my-4">Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

class SignUpFormBase extends Component {
  state = {
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null
  };

  onSubmit = event => {
    event.preventDefault();

    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUser(email, passwordOne)
      .then(authUser => {
        // creates the user in the firebase db using their username and email by referencing the auth db using the uid
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
      .then(() => {
        //set state back to original values
        this.setState({
          username: '',
          email: '',
          passwordOne: '',
          passwordTwo: '',
          error: null
        });
        //send them to home page
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <Row helper="justify-content-center">
        <Column size="md-6 12">
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                className="form-control"
                name="username"
                value={username}
                onChange={this.onChange}
                type="text"
                placeholder="Full Name"
              />
            </div>
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
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="form-group">
              <input
                className="form-control"
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
              />
            </div>
            <button
              className="btn btn-false"
              disabled={isInvalid}
              type="submit"
            >
              Sign Up
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </Column>
      </Row>
    );
  }
}

const SignUpLink = () => {
  return (
    <p>
      Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
    </p>
  );
};

const SignUpForm = compose(
  withRouter,
  withFirebase
)(SignUpFormBase);

export default SignUp;

export { SignUpForm, SignUpLink };
