import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../constants/routes';
import { useForm } from '../hooks/useForm';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { withFirebase } from '../components/Firebase';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';

const SignIn = () => (
  <Container>
    <div>
      <h1 className="text-center my-4">Sign In</h1>
      <SignInForm />
      <Row helper="justify-content-center">
        <Column size="md-6 12">
          <PasswordForgetLink />
          <SignUpLink />
        </Column>
      </Row>
    </div>
  </Container>
);

const SignInFormBase = props => {
  const { formState, setFormState, mapInputs } = useForm(
    {
      email: '',
      password: '',
      error: null,
      success: false
    },
    'sign-in'
  );

  const formOptions = [
    {
      placeholder: 'Email Address',
      type: 'text'
    },
    {}
  ];

  const displayInputs = mapInputs(formState, ['email', 'password'])(
    formOptions
  );

  const onSubmit = event => {
    event.preventDefault();
    const { email, password } = formState;
    localStorage.setItem('email', email);

    props.firebase
      .doSignInUser(email, password)
      .then(() => {
        speechSynthesis.speak(
          new SpeechSynthesisUtterance(`Welcome, ${email}. You've got mail!`)
        );

        setFormState({ email: '', password: '', error: null });
        props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        setFormState({ error });
      });
  };

  const { email, password, error } = formState;

  const isInvalid = password === '' || email === '';

  return (
    <Row helper="justify-content-center">
      <Column size="md-6 12">
        <form onSubmit={onSubmit}>
          <div className="form-group">{displayInputs}</div>
          <button
            className="btn btn-false mb-2"
            disabled={isInvalid}
            type="submit">
            Sign In
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </Column>
    </Row>
  );
};

const SignInForm = compose(
  withRouter,
  withFirebase
)(SignInFormBase);

export default SignIn;

export { SignInForm };
