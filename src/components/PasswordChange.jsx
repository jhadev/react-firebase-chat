import React from 'react';
import { withFirebase } from './Firebase/index';
import { useForm } from '../hooks/useForm';
import Row from './common/Row';
import Column from './common/Column';

const PasswordChangeForm = ({ firebase }) => {
  const { formState, setFormState, mapInputs } = useForm({
    passwordOne: '',
    passwordTwo: '',
    error: null,
    success: false
  });

  const filterInputsToDisplay = ({ passwordOne, passwordTwo }) => ({
    passwordOne,
    passwordTwo
  });

  const formOptions = [
    {
      type: 'password',
      placeholder: 'New Password'
    },
    {
      type: 'password',
      placeholder: 'Confirm Password'
    }
  ];

  const displayInputs = mapInputs(filterInputsToDisplay(formState))(
    formOptions
  );

  const onSubmit = event => {
    event.preventDefault();
    const { passwordOne } = formState;

    firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        // alert user here
        setFormState({
          passwordOne: '',
          passwordTwo: '',
          error: null,
          success: true
        });
      })
      .catch(error => {
        setFormState({ error });
      });
  };

  const { passwordOne, passwordTwo, error, success } = formState;

  const isInvalid = passwordOne !== passwordTwo || passwordOne === '';

  return (
    <Row helper="justify-content-center">
      <Column size="md-6 12">
        <h4 className="text-center my-4">Change your password.</h4>
        <form onSubmit={onSubmit}>
          <div className="form-group">{displayInputs}</div>
          <button disabled={isInvalid} className="btn btn-false" type="submit">
            Change Password
          </button>
          {error && <p>{error.message}</p>}
          {success && <p>Password successfully changed.</p>}
        </form>
      </Column>
    </Row>
  );
};

export default withFirebase(PasswordChangeForm);
