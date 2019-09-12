import React, { useReducer, useContext, useEffect } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import { INITIAL_STATE, reducer } from '../reducers/dmReducer';
import { useScroll } from '../hooks/useScroll';
import { useChat } from '../hooks/useChat';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';
import ChatList from '../components/ChatList';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
// import alert from '../sounds/sent.mp3';
// const alertSound = new Audio(alert);

const DirectMessages = ({ firebase }) => {
  // destructure individual state values, dispatch, and authUser from useChat return array
  // initialize it with imported reducer and initial state, firebase prop, and type for effect switch.
  const [{ users, chat, userToDm }, dispatch, authUser] = useChat(
    reducer,
    INITIAL_STATE,
    firebase,
    'dms'
  );

  // pass down scroll funcs as props from here, useScroll takes array to track and max length to stop smooth scroll
  const { scrollToBottom, scrollToTop } = useScroll(chat, 50);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_USER_TO_DM', userToDm: value });
  };

  // filter authUser from list can't dm yourself
  const handleDmList = arr => {
    return arr.filter(({ email }) => email !== authUser.email);
  };

  // get online status to display for each message.
  const getOnlineStatus = args => {
    if (users) {
      const foundUser = users.find(user => user.email === args);
      return foundUser;
    }
  };

  const handleLayout = ({ user, timestamp, message, id }, idx) => {
    const status = getOnlineStatus(user);

    return (
      <div
        key={id || idx}
        className={`animated align-items-${
          authUser.email === user ? 'end zoomInRight' : 'start zoomInLeft'
        } faster d-flex flex-column my-2`}>
        <Message
          color={authUser.email === user ? 'user' : 'receiver'}
          message={message}
          status={status ? status.online : null}
          user={user}
          timestamp={timestamp}
        />
      </div>
    );
  };

  const usersButNotAuthUser = handleDmList(users);

  return (
    <>
      <div className="white-space">
        <Container>
          <Row helper="mt-4">
            <Column size="12 md-3">
              <div className="sticky-top">
                <div id="spacer" />
                <h6 className="text-center">
                  You are chatting with:{' '}
                  <p>{userToDm !== '' ? userToDm : 'Select A User'}</p>
                </h6>
                <ChatList
                  rooms={usersButNotAuthUser}
                  setChatRoom={setChatRoom}
                  currentRoom={userToDm}
                  dms
                />
              </div>
            </Column>
            <Column size="12 md-9">
              <div className="wrapper">
                <div id="spacer" />
                <div className="mt-5">
                  {chat.length > 0 ? (
                    chat.map((message, idx) => handleLayout(message, idx))
                  ) : (
                    <h3 className="text-center">
                      {userToDm !== ''
                        ? 'No messages with this user yet.'
                        : 'Select a user to chat with.'}
                    </h3>
                  )}
                </div>
              </div>
            </Column>
          </Row>
        </Container>
      </div>
      <div className="sticky-footer">
        <Container>
          <MessageForm
            username={authUser.email}
            rooms={usersButNotAuthUser}
            receiver={userToDm}
            setChatRoom={setChatRoom}
            currentRoom={'dms'}
            firebase={firebase}
            scrollToTop={scrollToTop}
            scrollToBottom={scrollToBottom}
            dms
          />
        </Container>
      </div>
      <div id="bottom" />
    </>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(DirectMessages);
