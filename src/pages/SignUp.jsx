import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../components/Firebase/index';
import { useForm } from '../hooks/formHook';
import * as ROUTES from '../constants/routes';
import Row from '../components/common/Row';
import Column from '../components/common/Column';

const SignUp = () => {
  return (
    <div>
      <h1 className="text-center my-4">Sign Up</h1>
      <SignUpForm />
    </div>
  );
};

const SignUpFormBase = props => {
  const { formState, setFormState, onChange } = useForm({
    username: '',
    email: '',
    passwordOne: '',
    passwordTwo: '',
    error: null,
    success: false
  });

  const onSubmit = event => {
    event.preventDefault();

    const { username, email, passwordOne } = formState;

    props.firebase
      .doCreateUser(email, passwordOne)
      .then(authUser => {
        // creates the user in the firebase db using their username and email by referencing the auth db using the uid
        return props.firebase.user(authUser.user.uid).set({
          username,
          email
        });
      })
      .then(() => {
        //set state back to original values
        setFormState({
          username: '',
          email: '',
          passwordOne: '',
          passwordTwo: '',
          error: null
        });
        //send them to home page
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        setFormState({ error });
      });
  };

  const { username, email, passwordOne, passwordTwo, error } = formState;

  const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';

  return (
    <Row helper="justify-content-center">
      <Column size="md-6 12">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              className="form-control"
              name="username"
              value={username}
              onChange={onChange}
              type="text"
              placeholder="Full Name"
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              name="email"
              value={email}
              onChange={onChange}
              type="text"
              placeholder="Email Address"
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              name="passwordOne"
              value={passwordOne}
              onChange={onChange}
              type="password"
              placeholder="Password"
            />
          </div>
          <div className="form-group">
            <input
              className="form-control"
              name="passwordTwo"
              value={passwordTwo}
              onChange={onChange}
              type="password"
              placeholder="Confirm Password"
            />
          </div>
          <button className="btn btn-false" disabled={isInvalid} type="submit">
            Sign Up
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </Column>
    </Row>
  );
};

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
