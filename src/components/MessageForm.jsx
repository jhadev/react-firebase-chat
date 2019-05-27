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

const MessageForm = ({
  message,
  setMsg,
  packageMsg,
  sendMessage,
  handleCloudinary
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
          handleCloudinary(result.info.secure_url);
        }
      }
    );
  };

  return (
    <>
      <div className="sticky-footer">
        <Form onSubmit={packageMsg}>
          <FormGroup row>
            <Label for="exampleText" sm={2}>
              Chat!
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
                    event.key === 'Enter' ? sendMessage() : false
                  }
                />
              </InputGroup>
            </Col>
          </FormGroup>
          <button className="btn btn-primary mb-2">Send</button>
        </Form>
      </div>
    </>
  );
};

export default MessageForm;
