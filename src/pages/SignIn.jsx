import React from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import * as ROUTES from '../constants/routes';
import { useForm } from '../hooks/formHook';
import { SignUpLink } from './SignUp';
import { PasswordForgetLink } from './PasswordForget';
import { withFirebase } from '../components/Firebase/index';
import Row from '../components/common/Row';
import Column from '../components/common/Column';

const SignIn = () => (
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
);

const SignInFormBase = props => {
  const { formState, setFormState, onChange } = useForm({
    email: '',
    password: '',
    error: null,
    success: false
  });

  const onSubmit = event => {
    event.preventDefault();
    const { email, password } = formState;
    localStorage.setItem('email', email);

    props.firebase
      .doSignInUser(email, password)
      .then(() => {
        speechSynthesis.speak(
          new SpeechSynthesisUtterance(`Welcome, ${email}`)
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
              name="password"
              value={password}
              onChange={onChange}
              type="password"
              placeholder="Password"
            />
          </div>
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
