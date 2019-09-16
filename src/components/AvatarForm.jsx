import React, { useContext, useEffect } from 'react';
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
      avatar: ''
    },
    'avatar'
  );

  useEffect(() => {
    const preview = async () => {
      await swal({
        buttons: {
          cancel: 'Cancel',
          submit: 'Submit'
        },
        content: (
          <div>
            <h1>Preview</h1>
            <img
              src={formState.avatar}
              alt={'avatar'}
              className={'img-fluid'}
            />
            <p className="mt-2">If you like this image click Submit.</p>
          </div>
        )
      }).then(willSubmit => {
        if (willSubmit) {
          props.firebase.setAvatar(authUser, formState.avatar);
          swal({
            title: 'Success',
            icon: 'success',
            button: 'Cool',
            content: (
              <p className="text-center">
                {authUser.email}, your avatar has been updated!
              </p>
            )
          });

          setFormState({ avatar: '' });
        } else {
          setFormState({ avatar: '' });
        }
      });
    };

    if (REGEX.imgUrlPattern.test(formState.avatar)) {
      preview();
    }
  }, [authUser, formState.avatar, props.firebase, setFormState]);

  const formOptions = [
    {
      label:
        'Paste a valid url ending in .jpg, .jpeg, .gif, or .png and a preview of your image will be displayed.'
    }
  ];

  const displayInputs = mapInputs(formState)(formOptions);

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
        <div>
          <button className="btn btn-true" onClick={widget}>
            Upload Image
          </button>
        </div>
      </Column>
    </Row>
  );
};

export default withFirebase(AvatarForm);
