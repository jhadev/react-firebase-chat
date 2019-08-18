import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { withFirebase } from '../components/Firebase/index';
import { useForm } from '../hooks/formHook';
import Row from '../components/common/Row';
import Column from '../components/common/Column';

const PasswordForget = () => (
  <div>
    <div className="my-4">
      <PasswordForgetForm />
    </div>
  </div>
);

const PasswordForgetFormBase = ({ firebase }) => {
  const { formState, setFormState, onChange } = useForm({
    email: '',
    error: null,
    success: false
  });

  const onSubmit = event => {
    event.preventDefault();

    const { email } = formState;

    firebase
      .doPasswordReset(email)
      .then(() => {
        setFormState({ email: '', error: null, success: true });
      })
      .catch(error => {
        setFormState({ error });
      });
  };

  const { email, error, success } = formState;

  const isInvalid = email === '';

  return (
    <Row helper="justify-content-center">
      <Column size="md-6 12">
        <h4 className="text-center mb-4">Forgot your password?</h4>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              name="email"
              value={email}
              onChange={onChange}
              type="text"
              placeholder="Email Address"
              className="form-control"
            />
          </div>
          <button
            disabled={isInvalid}
            className="btn btn-false mb-2"
            type="submit">
            Reset Password
          </button>

          {error && <p>{error.message}</p>}
          {success && (
            <p>Check your email for a link to change your password.</p>
          )}
        </form>
      </Column>
    </Row>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForget;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };