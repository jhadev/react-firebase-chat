import React, { useContext } from 'react';
import { useForm } from '../hooks/useForm';
import { withFirebase } from './Firebase';
import { AuthUserContext } from './Session';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import * as REGEX from '../constants/regex';

const AvatarForm = props => {
  const authUser = useContext(AuthUserContext);

  const { formState, setFormState, mapInputs } = useForm(
    {
      avatar: '',
      error: null,
      success: ''
    },
    'avatar'
  );

  const formOptions = [
    { label: 'Must be valid url ending in .jpg, .jpeg, .gif, or .png' }
  ];

  const displayInputs = mapInputs(formState, ['avatar'])(formOptions);

  const submitAvatar = () => {
    if (!REGEX.imgUrlPattern.test(formState.avatar)) {
      return setFormState({
        error: 'You need to submit a .jpg, .jpeg, .gif, or .png image link.'
      });
    } else {
      props.firebase.setAvatar(authUser, formState.avatar);
      setFormState({
        avatar: '',
        error: null,
        success: 'Success your avatar has been set!'
      });
    }
  };

  return (
    <Row helper="justify-content-center my-4">
      <Column size="md-6 12">
        <h4 className="text-center">Set Your Avatar</h4>
        <div className="form-group">{displayInputs}</div>
        {formState.error && <div>{formState.error}</div>}
        {formState.success && <div>{formState.success}</div>}
        <button
          className={'btn btn-true'}
          onClick={submitAvatar}
          disabled={formState.avatar === ''}>
          Submit
        </button>
      </Column>
    </Row>
  );
};

export default withFirebase(AvatarForm);
