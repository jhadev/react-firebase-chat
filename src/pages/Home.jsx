import React, { useEffect, useContext, useReducer } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import { INITIAL_STATE, reducer } from '../reducers/chatReducer';
import { useScroll } from '../hooks/scrollHook';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import ChatList from '../components/ChatList';
import Container from '../components/common/Container';
import alert from '../sounds/sent.mp3';
const alertSound = new Audio(alert);

const Home = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);
  const [{ showChat, chat, room, roomList }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );

  const { scrollToBottom } = useScroll(chat);

  console.log(authUser);

  // const scrollToBottom = () => {
  //   document.getElementById('bottom').scrollIntoView(false);
  // };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    firebase
      .allRooms()
      .then(res => {
        dispatch({ type: 'SET_ROOM_LIST', roomList: res });
      })
      .catch(err => console.log(err));
  }, [firebase]);

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) {
        const messages = Object.values(snapshot.val());
        // remove first msg bc it is a placeholder to create a new room
        messages.shift();
        dispatch({ type: 'SET_MESSAGES', chat: messages });
        alertSound.play();
      }
    };
    firebase.chat(room).on('value', handleNewMessages);
    return () => {
      firebase.chat(room).off('value', handleNewMessages);
    };
  }, [firebase, room]);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_ROOM', room: value });
  };

  const handleLayout = ({ user, timestamp, message, id }, idx) => {
    return (
      <div
        key={id || idx}
        className={`animated zoomIn d-flex flex-column my-2 align-items-${
          authUser.email === user ? 'end' : 'start'
        }`}>
        <Message
          color={authUser.email === user ? 'user' : 'receiver'}
          message={message}
          user={user}
          timestamp={timestamp}
        />
      </div>
    );
  };

  return (
    <>
      <div className="text-center">
        <h1 className=" welcome my-4">Welcome, {authUser.email}</h1>
        <button
          className={`btn btn-${showChat} btn-lg`}
          onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}>
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
                        chat.map((message, idx) => handleLayout(message, idx))
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
          <div id="bottom" />
        </>
      )}
    </>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
