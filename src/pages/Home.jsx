import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import { INITIAL_STATE, reducer } from '../reducers/chatReducer';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import ChatList from '../components/ChatList';
import Container from '../components/common/Container';
import Search from '../components/Search';
import alert from '../sounds/sent.mp3';
const alertSound = new Audio(alert);

const Home = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);
  const [{ showChat, chat, room, roomList }, dispatch] = useReducer(
    reducer,
    INITIAL_STATE
  );

  const scrollToBottom = useCallback(() => {
    if (chat.length > 50) {
      document.getElementById('bottom').scrollIntoView(false);
    } else {
      document.getElementById('bottom').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [chat.length]);

  const scrollToTop = useCallback(() => {
    if (chat.length > 50) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [chat.length]);

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

  useEffect(() => {
    scrollToBottom();
  }, [chat, scrollToBottom]);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_ROOM', room: value });
  };

  const handleLayout = ({ user, timestamp, message, id }, idx) => {
    return (
      <div
        key={id || idx}
        className={`animated align-items-${
          authUser.email === user ? 'end zoomInRight' : 'start zoomInLeft'
        } faster d-flex flex-column my-2`}>
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
    <div>
      <div className="text-center">
        <h1 className=" welcome my-4">Welcome, {authUser.email}</h1>
        <button
          className={`btn btn-${showChat} btn-lg`}
          onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}>
          {!showChat ? 'Show Chat' : 'Hide Chat'}
        </button>
      </div>
      {showChat ? (
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
                    <button
                      className={`btn btn-${showChat} btn-block`}
                      onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}>
                      {!showChat ? 'Show Chat' : `Search ${room}`}
                    </button>
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
      ) : (
        <Container>
          <Search
            showChat={showChat}
            dispatch={dispatch}
            room={room}
            chat={chat}
          />
        </Container>
      )}
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
