/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import Row from './common/Row';
import Column from './common/Column';
import Message from './Message';
import MessageForm from './MessageForm';
import ChatList from './ChatList';
import Container from './common/Container';
import alert from '../sounds/sent.mp3';
import uuid from 'uuidv4';

const Home = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);

  const [showChat, handleChange] = useState(true);
  const [chat, setChat] = useState([]);
  const [room, setRoom] = useState('chat');
  const [roomList, setRoomList] = useState([]);

  const alertSound = new Audio(alert);

  //refers to current room string in state
  //returns all array of all rooms
  const allRooms = firebase.allRooms();
  const chatroom = firebase.chat(room);

  useEffect(() => {
    allRooms
      .then(res => {
        setRoomList(res);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) {
        const messages = Object.values(snapshot.val());
        messages.shift();
        setChat(messages);
        alertSound.play();
      }
    };
    chatroom.on('value', handleNewMessages);
    return () => {
      chatroom.off('value', handleNewMessages);
    };
  }, [room]);

  useEffect(() => {
    scrollToBottom();
  }, [chat, room]);

  const scrollToBottom = () => {
    const scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const setChatRoom = event => {
    const { value } = event.target;
    setRoom(value);
  };

  const handleLayout = ({ user, timestamp, message }) => {
    if (authUser.email === user) {
      return (
        <div key={uuid()} className="d-flex flex-column align-items-end my-2">
          <Message
            color="user"
            message={message}
            user={user}
            timestamp={timestamp}
          />
        </div>
      );
    } else {
      return (
        <div key={uuid()} className="d-flex flex-column align-items-start my-2">
          <Message
            color="receiver"
            message={message}
            user={user}
            timestamp={timestamp}
          />
        </div>
      );
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className=" welcome my-4">Welcome, {authUser.email}</h1>
        <button
          className={`btn btn-${showChat} btn-lg`}
          onClick={() => {
            handleChange(!showChat);
          }}
        >
          {!showChat ? 'Show Chat' : 'Hide Chat'}
        </button>
      </div>
      {showChat && (
        <>
          <div className="white-space">
            <Container>
              <Row helper="mt-4">
                <Column size="12 md-2">
                  <div className="sticky-top">
                    <div id="spacer" />
                    <h6>Current Room: {room}</h6>
                    <ChatList
                      rooms={roomList}
                      setChatRoom={setChatRoom}
                      currentRoom={room}
                    />
                  </div>
                </Column>
                <Column size="12 md-10">
                  <div className="wrapper">
                    <div id="spacer" />
                    <>
                      {chat.length > 0 ? (
                        chat.map(message => handleLayout(message))
                      ) : (
                        <h3 className="text-center text-dark">
                          No messages in this room yet. Get the party started.
                        </h3>
                      )}
                    </>
                  </div>
                </Column>
              </Row>
            </Container>
          </div>
          <div className="sticky-footer">
            <Container>
              <MessageForm
                username={authUser.email}
                rooms={roomList}
                setChatRoom={setChatRoom}
                currentRoom={room}
                firebase={firebase}
                scrollToTop={scrollToTop}
                scrollToBottom={scrollToBottom}
              />
            </Container>
          </div>
        </>
      )}
    </>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
