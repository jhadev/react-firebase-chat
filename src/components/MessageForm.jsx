import React from 'react';
import {
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';
import PropTypes from 'prop-types';

const MessageForm = ({
  message,
  setMsg,
  packageMsg,
  sendMessage,
  handleCloudinary,
  counter
}) => {
  const widget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ['react-firebase-chat'],
        sources: ['local', 'url'],
        defaultSource: 'local'
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          if (message !== '') {
            handleCloudinary(`${message} ${result.info.secure_url}`);
          } else {
            handleCloudinary(result.info.secure_url);
          }
        }
      }
    );
  };

  const maxCount = 200;

  return (
    <>
      <div className="sticky-footer">
        <Form onSubmit={packageMsg}>
          <FormGroup row>
            <Label for="exampleText" sm={2}>
              {counter < maxCount
                ? (counter - maxCount * 1).toString().slice(1)
                : 0}{' '}
              chars remaining
            </Label>
            <Col sm={10}>
              <InputGroup className="mt-2" size="md">
                <InputGroupAddon onClick={widget} addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-camera" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="textarea"
                  name="text"
                  id="exampleText"
                  value={message}
                  onChange={setMsg}
                  onKeyUp={event =>
                    event.key === 'Enter' && counter <= maxCount
                      ? sendMessage()
                      : false
                  }
                />
              </InputGroup>
            </Col>
          </FormGroup>
          <button
            disabled={counter > maxCount}
            className="btn btn-primary mb-2"
          >
            Send
          </button>
        </Form>
      </div>
    </>
  );
};

MessageForm.propTypes = {
  message: PropTypes.string,
  setMsg: PropTypes.func,
  packageMsg: PropTypes.func,
  sendMessage: PropTypes.func,
  handleCloudinary: PropTypes.func,
  counter: PropTypes.number
};

export default MessageForm;
