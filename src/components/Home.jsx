/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import Container from './common/Container';
import Row from './common/Row';
import Column from './common/Column';
import Message from './Message';
import MessageForm from './MessageForm';
import ChatList from './ChatList';
import moment from 'moment';

const Home = props => {
  // const divRef = useRef(null);
  const [showChat, handleChange] = useState(false);
  const [username, setUsername] = useState('');
  const [timestamp, setTimestamp] = useState('');
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState(null);
  const [charCounter, setCounter] = useState(0);
  const [room, setRoom] = useState('test');
  const [roomList, setRoomList] = useState([]);

  //refers to current room string in state
  const chatroom = props.firebase.chat(room);
  //returns all array of all rooms
  const allRooms = props.firebase.allRooms();
  /* TODO
  store all rooms in state on mount - check
  render list group based on all rooms in state
  onclick of list group setRoom to corresponding value
  
  */

  useEffect(() => {
    allRooms.then(res => {
      setRoomList(res);
    });
  }, []);

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) setChat(snapshot.val());
    };
    chatroom.on('value', handleNewMessages);
    return () => {
      chatroom.off('value', handleNewMessages);
    };
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  // const prevMessageRef = useRef();
  // useEffect(() => {
  //   prevMessageRef.current = message;
  // });
  // const prevMessage = prevMessageRef.current;

  const scrollToBottom = () => {
    const scrollingElement = document.scrollingElement || document.body;
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
  };

  const sendMessage = () => {
    if (message !== '') {
      let messageObj = {
        user: username,
        timestamp: timestamp,
        message: message
      };
      props.firebase.send(room, messageObj);
    }
    setMessage('');
    setTimestamp('');
    setCounter(0);
  };

  const packageMsg = event => {
    event.preventDefault();
    sendMessage();
  };

  const handleCloudinary = str => {
    setMessage(str);
    setTimestamp(moment().format('LLLL'));
  };

  const setMsg = event => {
    const { value } = event.target;
    setTimestamp(moment().format('LLLL'));
    setMessage(value);
    setCounter(value.length);
  };

  const setChatRoom = event => {
    console.log('clicked');
    const { name, value } = event.target;
    console.log(name);
    setRoom(value);
  };

  const handleLayout = (authUser, chat, message) => {
    if (authUser.email === chat[message]['user']) {
      return (
        <div className="d-flex flex-column align-items-end my-1" key={message}>
          <Message
            color="primary"
            message={chat[message]['message']}
            user={chat[message]['user']}
            timestamp={chat[message]['timestamp']}
          />
        </div>
      );
    } else {
      return (
        <div
          className="d-flex flex-column align-items-start my-1"
          key={message}
        >
          <Message
            color="secondary"
            message={chat[message]['message']}
            user={chat[message]['user']}
            timestamp={chat[message]['timestamp']}
            displayName={authUser.username}
          />
        </div>
      );
    }
  };

  return (
    <>
      <AuthUserContext.Consumer>
        {authUser => (
          <Container fluid>
            <div className="text-center">
              <h1 className=" welcome my-4">Welcome, {authUser.email}</h1>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  handleChange(!showChat);
                  setUsername(authUser.email);
                }}
              >
                {!showChat ? 'Show Chat' : 'Hide Chat'}
              </button>
            </div>
            {showChat && (
              <Row helper="mt-4">
                <Column size="12 md-2">
                  <h6>Current Room: {room}</h6>
                  <ChatList rooms={roomList} setChatRoom={setChatRoom} />
                </Column>
                <Column size="12 md-10">
                  <div className="wrapper">
                    <>
                      {chat !== null &&
                        Object.keys(chat).map(message =>
                          handleLayout(authUser, chat, message)
                        )}
                    </>
                  </div>
                  <MessageForm
                    message={message}
                    setMsg={setMsg}
                    packageMsg={packageMsg}
                    sendMessage={sendMessage}
                    handleCloudinary={handleCloudinary}
                    counter={charCounter}
                  />
                </Column>
              </Row>
            )}
          </Container>
        )}
      </AuthUserContext.Consumer>
    </>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
