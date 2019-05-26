import React from 'react';
import { Col, Form, FormGroup, Label, Input } from 'reactstrap';

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
              <div className="input-group py-3">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                  onClick={widget}
                >
                  <div id="upload" className="cloudinary btn btn-sm">
                    <i className="fas fa-camera" />
                  </div>
                </span>
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
              </div>
            </Col>
          </FormGroup>
          <button className="btn btn-primary mb-2">Send</button>
        </Form>
      </div>
    </>
  );
};

export default MessageForm;
