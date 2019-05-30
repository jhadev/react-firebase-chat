import React from 'react';
import ChatList from './ChatList';
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
  counter,
  handleDropdown,
  isOpen,
  rooms,
  setChatRoom,
  currentRoom
}) => {
  console.log(message);
  const widget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ['react-firebase-chat'],
        sources: ['local', 'url', 'image_search'],
        googleApiKey: process.env.REACT_APP_GOOGLE_IMAGE_SEARCH,
        defaultSource: 'local',
        multiple: false,
        folder: 'react_chat',
        clientAllowedFormats: ['png', 'gif', 'jpeg', 'jpg'],
        maxFileSize: 10000000,
        showUploadMoreButton: false
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log(result);
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
          <FormGroup id="messageForm" row>
            <Label for="chatInput" className="text-center" md={2} sm={2}>
              {counter < maxCount
                ? (counter - maxCount).toString().slice(1)
                : 0}{' '}
              chars remaining
            </Label>
            <Col md={10} sm={12}>
              <InputGroup className="mt-2 mb-3" size="md">
                <InputGroupAddon onClick={handleDropdown} addonType="prepend">
                  <InputGroupText id="roomBtnInput">
                    <ChatList
                      rooms={rooms}
                      setChatRoom={setChatRoom}
                      currentRoom={currentRoom}
                      isOpen={isOpen}
                      handleDropdown={handleDropdown}
                      dropdown
                    />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon onClick={widget} addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-camera" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="textarea"
                  name="text"
                  id="chatInput"
                  value={message}
                  onChange={setMsg}
                  // onKeyUp={event =>
                  //   event.key === 'Enter' && counter <= maxCount
                  //     ? sendMessage()
                  //     : alert('please enter text')
                  // }
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText id="sendBtnInput">
                    <button
                      disabled={counter > maxCount}
                      className="btn font-weight-bold text-dark btn-link"
                      type="submit"
                    >
                      Send
                    </button>
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </Col>
          </FormGroup>
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
  counter: PropTypes.number,
  handleDropdown: PropTypes.func,
  isOpen: PropTypes.bool,
  rooms: PropTypes.array,
  setChatRoom: PropTypes.func,
  currentRoom: PropTypes.string
};

export default MessageForm;
