import React, { useState, useEffect } from 'react';
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
import uuid from 'uuidv4';
import moment from 'moment';
import 'emoji-mart/css/emoji-mart.css';
import EmojiContainer from './EmojiContainer';
import swal from '@sweetalert/with-react';
import sent from '../sounds/sentmessage.mp3';
import './styles/components/message-form.scss';

const sentSound = new Audio(sent);

const MessageForm = ({
  rooms,
  setChatRoom,
  currentRoom,
  firebase,
  username,
  scrollToTop,
  scrollToBottom,
  receiver,
  uid,
  dms
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [charCounter, setCounter] = useState(0);
  const [emojiPicker, handlePickerOpen] = useState(false);
  const [scrollTop, setScrollDirection] = useState(false);
  const [whoseTyping, setWhoseTyping] = useState([]);

  const maxCount = 200;

  useEffect(() => {
    setScrollDirection(false);
  }, [currentRoom]);

  useEffect(() => {
    if (scrollTop) {
      scrollToTop();
    } else {
      scrollToBottom();
    }
  }, [scrollToBottom, scrollToTop, scrollTop]);

  useEffect(() => {
    if (!dms) {
      if (charCounter > 0) {
        firebase.typing(uid).update({
          username,
          isTyping: true,
          currentRoom
        });
      } else {
        firebase.typing(uid).update({
          username,
          isTyping: false,
          currentRoom
        });
      }
    }
  }, [charCounter, currentRoom, dms, firebase, uid, username]);

  useEffect(() => {
    if (!dms) {
      const handleTyping = snapshot => {
        if (snapshot.val()) {
          const allUsers = Object.values(snapshot.val());

          const typers = allUsers
            .filter(
              user =>
                user.isTyping &&
                user.username !== username &&
                currentRoom === user.currentRoom
            )
            .map(user => user.username);

          setWhoseTyping(typers);
        }
      };
      firebase.typingRef().on('value', handleTyping);
      return () => {
        firebase.typingRef().off('value', handleTyping);
      };
    }
  }, [currentRoom, dms, firebase, username]);

  const sendNewMessage = e => {
    e.preventDefault();
    if (newMessage !== '' && newMessage.length > 1 && charCounter <= maxCount) {
      let messageObj = {
        id: uuid(),
        uid,
        user: username,
        timestamp: moment().format('LLLL'),
        message: newMessage,
        receiver: receiver ? receiver : ''
      };
      firebase.send(currentRoom, messageObj);
      sentSound.play();
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
          swal({
            button: {
              text: 'Close',
              closeModal: true
            },
            icon: 'success',
            title: 'Success!',
            text: `${url} has been inserted into the text box.`
          });
          setNewMessage(prevMessage =>
            prevMessage.length > 0
              ? prevMessage.concat(` ${result.info.secure_url}`)
              : `${result.info.secure_url}`
          );
        }
        // } else {
        //   swal({
        //     button: {
        //       text: 'Close',
        //       closeModal: true
        //     },
        //     icon: 'error',
        //     title: 'Error',
        //     text: `Please try again :(`
        //   });
        // }
      }
    );
  };

  console.log(whoseTyping);

  return (
    <>
      <div className="sticky-footer">
        {whoseTyping.length > 0 &&
          (whoseTyping.length === 1 ? (
            <div className="typers">
              <span className="focus-in-expand-fwd">
                {whoseTyping.join(', ')} is typing...
              </span>
            </div>
          ) : (
            <div className="typers">
              <span className="focus-in-expand-fwd">
                {whoseTyping.join(', ')} are typing...
              </span>
            </div>
          ))}
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
                  onClick={() =>
                    setScrollDirection(prevDirection => !prevDirection)
                  }
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
                    <i className="fas fa-paperclip">
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
                      dms={dms}
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
