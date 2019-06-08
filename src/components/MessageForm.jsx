import React, { useState } from 'react';
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
import moment from 'moment';
import PropTypes from 'prop-types';

const MessageForm = ({
  message,
  handleDropdown,
  isOpen,
  rooms,
  setChatRoom,
  currentRoom,
  firebase,
  username
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [charCounter, setCounter] = useState(0);

  const sendNewMessage = e => {
    e.preventDefault();
    if (newMessage !== '' && newMessage.length > 1 && charCounter <= maxCount) {
      let messageObj = {
        user: username,
        timestamp: timestamp,
        message: newMessage
      };
      firebase.send(currentRoom, messageObj);
    }

    setNewMessage('');
    setTimestamp('');
    setCounter(0);
  };

  const handleCloudinary = str => {
    setNewMessage(str);
    setTimestamp(moment().format('LLLL'));
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
        <Form onSubmit={sendNewMessage}>
          <FormGroup id="messageForm" row>
            <Label for="chatInput" className="text-center" md={2} sm={2}>
              {charCounter < maxCount
                ? (charCounter - maxCount).toString().slice(1)
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
                  value={newMessage}
                  onChange={e => {
                    setNewMessage(e.target.value);
                    setTimestamp(moment().format('LLLL'));
                    setCounter(e.target.value.length);
                  }}
                  onKeyUp={event =>
                    event.key === 'Enter' && sendNewMessage(event)
                  }
                />
                <InputGroupAddon addonType="append">
                  <InputGroupText id="sendBtnInput">
                    <button
                      disabled={
                        charCounter > maxCount || newMessage.length === 0
                      }
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
  handleCloudinary: PropTypes.func,
  charCounter: PropTypes.number,
  handleDropdown: PropTypes.func,
  isOpen: PropTypes.bool,
  rooms: PropTypes.array,
  setChatRoom: PropTypes.func,
  currentRoom: PropTypes.string
};

export default MessageForm;
