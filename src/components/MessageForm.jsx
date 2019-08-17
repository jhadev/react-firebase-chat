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
import uuid from 'uuidv4';
import moment from 'moment';
import 'emoji-mart/css/emoji-mart.css';
import EmojiContainer from './EmojiContainer';
import swal from '@sweetalert/with-react';
import './styles/components/message-form.scss';

const MessageForm = ({
  rooms,
  setChatRoom,
  currentRoom,
  firebase,
  username,
  scrollToTop,
  scrollToBottom,
  receiver,
  dms
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [charCounter, setCounter] = useState(0);
  const [emojiPicker, handlePickerOpen] = useState(false);
  const [scrollTop, setScrollDirection] = useState(false);

  const maxCount = 200;

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
        id: uuid(),
        user: username,
        timestamp: moment().format('LLLL'),
        message: newMessage,
        receiver: receiver ? receiver : ''
      };
      firebase.send(currentRoom, messageObj);

      setNewMessage('');
      setCounter(0);
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
        multiple: false,
        folder: 'react_chat',
        clientAllowedFormats: ['png', 'gif', 'jpeg', 'jpg'],
        maxFileSize: 10000000,
        showUploadMoreButton: false
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          console.log(result);
          const url = result.info.secure_url;

          navigator.clipboard.writeText(url).then(
            () => {
              /* clipboard successfully set */
              swal({
                button: {
                  text: 'Close',
                  closeModal: true
                },
                icon: 'success',
                title: 'Success!',
                text: `${url} has been copied to the clipboard.`
              });
            },
            () => {
              swal({
                button: {
                  text: 'Close',
                  closeModal: true
                },
                icon: 'error',
                title: 'Oops...',
                text: `${url} has not been copied to the clipboard. Copy it from this modal.`
              });
            }
          );
          // setNewMessage(prevMessage =>
          //   prevMessage.length > 0
          //     ? prevMessage.concat(` ${result.info.secure_url}`)
          //     : `${result.info.secure_url}`
          // );
        }
      }
    );
  };

  return (
    <>
      <div className="sticky-footer">
        <Form onSubmit={sendNewMessage}>
          <FormGroup id="messageForm" row>
            <Label
              for="chatInput"
              className="text-center counter"
              md={2}
              sm={2}>
              {charCounter < maxCount
                ? (charCounter - maxCount).toString().slice(1)
                : 0}{' '}
              chars remaining
            </Label>
            <Col md={10} sm={12}>
              <InputGroup className="my-2" size="md">
                <InputGroupAddon
                  onClick={() => setScrollDirection(!scrollTop)}
                  addonType="prepend">
                  <InputGroupText id="scrollToTop">
                    {!scrollTop ? (
                      <i className="fas fa-arrow-circle-up text-dark">
                        <span className="tooltip-text">Scroll Up</span>
                      </i>
                    ) : (
                      <i className="fas fa-arrow-circle-down text-dark">
                        <span className="tooltip-text">Scroll Down</span>
                      </i>
                    )}
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon onClick={widget} addonType="prepend">
                  <InputGroupText>
                    <i class="fas fa-paperclip">
                      <span className="tooltip-text">Upload Images</span>
                    </i>
                  </InputGroupText>
                </InputGroupAddon>
                <InputGroupAddon
                  id="Popover1"
                  onClick={() => handlePickerOpen(!emojiPicker)}
                  addonType="prepend">
                  <EmojiContainer setNewMessage={setNewMessage} />
                  <InputGroupText>
                    <i className="far fa-grin-tongue-squint text-dark">
                      <span className="tooltip-text">Emojis</span>
                    </i>
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
                      type="submit">
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
