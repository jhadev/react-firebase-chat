import React, { useContext } from 'react';
import { useForm } from '../hooks/useForm';
import { withFirebase } from './Firebase';
import { AuthUserContext } from './Session';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import * as REGEX from '../constants/regex';
import swal from '@sweetalert/with-react';

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

  const widget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ['react-firebase-chat'],
        sources: ['local', 'url', 'image_search'],
        googleApiKey: process.env.REACT_APP_GOOGLE_IMAGE_SEARCH,
        defaultSource: 'local',
        cropping: true,
        multiple: false,
        folder: 'react_chat/avatars',
        clientAllowedFormats: ['png', 'gif', 'jpeg', 'jpg'],
        maxFileSize: 10000000,
        maxImageWidth: 1200,
        maxImageHeight: 1200,
        croppingValidateDimensions: true,
        showUploadMoreButton: false
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log(result);
          const url = result.info.secure_url;
          swal({
            button: {
              text: 'Close',
              closeModal: true
            },
            icon: 'success',
            title: 'Success!',
            text: `${url} has been inserted into the text box.`
          });
          setFormState({ avatar: url });
        }
      }
    );
  };

  return (
    <Row helper="justify-content-center my-4">
      <Column size="md-6 12">
        <h4 className="text-center">Set Your Avatar</h4>
        <div className="form-group">{displayInputs}</div>
        {formState.error && <div>{formState.error}</div>}
        {formState.success && <div>{formState.success}</div>}
        <div>
          <button className="btn btn-false" onClick={widget}>
            Upload Image
          </button>
        </div>
        <div>
          <button
            className={'btn btn-true mt-2'}
            onClick={submitAvatar}
            disabled={formState.avatar === ''}>
            Submit
          </button>
        </div>
      </Column>
    </Row>
  );
};

export default withFirebase(AvatarForm);
