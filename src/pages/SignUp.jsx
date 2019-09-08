import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../components/Firebase/index';
import { useForm } from '../hooks/useForm';
import * as ROUTES from '../constants/routes';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null
};

const SignUp = () => {
  return (
    <Container>
      <h1 className="text-center my-4">Sign Up</h1>
      <SignUpForm />
    </Container>
  );
};

const SignUpFormBase = props => {
  const { formState, setFormState, mapInputs } = useForm(
    INITIAL_STATE,
    'sign-up'
  );

  const formOptions = [
    {
      label: 'Full Name',
      placeholder: 'Full Name',
      type: 'text'
    },
    { label: 'Email Address', placeholder: 'Email Address', type: 'text' },
    { label: 'Enter Your Password', placeholder: 'Password', type: 'password' },
    {
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      type: 'password'
    }
  ];

  const inputs = ['username', 'email', 'passwordOne', 'passwordTwo'];

  const displayInputs = mapInputs(formState, inputs)(formOptions);

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
        setFormState(INITIAL_STATE);
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
          <div className="form-group">{displayInputs}</div>
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
