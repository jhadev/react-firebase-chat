/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import Row from './common/Row';
import Column from './common/Column';
import Message from './Message';
import MessageForm from './MessageForm';
import ChatList from './ChatList';

const Home = props => {
  const authUser = useContext(AuthUserContext);

  const [showChat, handleChange] = useState(true);
  const [chat, setChat] = useState(null);
  const [room, setRoom] = useState('chat');
  const [roomList, setRoomList] = useState([]);
  const [dropdownOpen, setDropdown] = useState(false);

  //refers to current room string in state
  //returns all array of all rooms
  const allRooms = props.firebase.allRooms();
  const chatroom = props.firebase.chat(room);

  useEffect(() => {
    allRooms
      .then(res => {
        setRoomList(res);
      })
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) setChat(snapshot.val());
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

  const handleDropdown = () => {
    setDropdown(!dropdownOpen);
  };

  const setChatRoom = event => {
    const { value } = event.target;
    setRoom(value);
  };

  const handleLayout = (chat, message) => {
    if (authUser.email === chat[message]['user']) {
      return (
        <div className="d-flex flex-column align-items-end my-1" key={message}>
          <Message
            color="user"
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
            color="receiver"
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
      {/* <Container fluid> */}
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
                <>
                  {chat !== null &&
                    Object.keys(chat).map(message =>
                      handleLayout(chat, message)
                    )}
                </>
              </div>
            </Column>
          </Row>
          <MessageForm
            username={authUser.email}
            handleDropdown={handleDropdown}
            isOpen={dropdownOpen}
            rooms={roomList}
            setChatRoom={setChatRoom}
            currentRoom={room}
            firebase={props.firebase}
            scrollToTop={scrollToTop}
            scrollToBottom={scrollToBottom}
          />
        </>
      )}
      {/* </Container> */}
    </>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
