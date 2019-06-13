/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import ChatList from './ChatList';
// import Footer from './common/Footer';
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
import 'emoji-mart/css/emoji-mart.css';
import EmojiContainer from './EmojiContainer';
import './MessageForm.scss';

const MessageForm = ({
  rooms,
  setChatRoom,
  currentRoom,
  firebase,
  username,
  scrollToTop,
  scrollToBottom
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [charCounter, setCounter] = useState(0);
  const [emojiPicker, handlePickerOpen] = useState(false);
  const [scrollTop, setScrollDirection] = useState(true);

  useEffect(() => {
    if (scrollTop) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  }, [scrollTop]);

  const sendNewMessage = e => {
    e.preventDefault();
    if (newMessage !== '' && newMessage.length > 1 && charCounter <= maxCount) {
      let messageObj = {
        user: username,
        timestamp: moment().format('LLLL'),
        message: newMessage
      };
      firebase.send(currentRoom, messageObj);
    }

    setNewMessage('');
    setCounter(0);
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
          setNewMessage(prevMessage =>
            prevMessage.concat(` ${result.info.secure_url}`)
          );
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
            <Label
              for="chatInput"
              className="text-center text-light"
              md={2}
              sm={2}
            >
              {charCounter < maxCount
                ? (charCounter - maxCount).toString().slice(1)
                : 0}{' '}
              chars remaining
            </Label>
            <Col md={10} sm={12}>
              <InputGroup className="mt-2 mb-3" size="md">
                <InputGroupAddon
                  onClick={() => setScrollDirection(!scrollTop)}
                  addonType="prepend"
                >
                  <InputGroupText id="scrollToTop">
                    {!scrollTop ? (
                      <i className="fas fa-arrow-circle-up text-dark" />
                    ) : (
                      <i className="fas fa-arrow-circle-down text-dark" />
                    )}
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText id="roomBtnInput">
                    <ChatList
                      rooms={rooms}
                      setChatRoom={setChatRoom}
                      currentRoom={currentRoom}
                      dropdown
                    />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon onClick={widget} addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-camera text-dark" />
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon
                  id="Popover1"
                  onClick={() => handlePickerOpen(!emojiPicker)}
                  addonType="prepend"
                >
                  <EmojiContainer setNewMessage={setNewMessage} />
                  <InputGroupText>
                    <i className="far fa-grin-tongue-squint text-dark" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  type="textarea"
                  name="text"
                  id="chatInput"
                  value={newMessage}
                  onChange={e => {
                    setNewMessage(e.target.value);
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

export default MessageForm;
