/* eslint-disable react-hooks/exhaustive-deps */
import React, { useReducer, useContext, useEffect } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import { INITIAL_STATE, reducer } from '../reducers/dmReducer';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';
import ChatList from '../components/ChatList';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import alert from '../sounds/sent.mp3';

const DirectMessages = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const { users, chat, userToDm } = state;
  // ref for dms collection in fb
  const chatroom = firebase.dms();
  const alertSound = new Audio(alert);
  
  useEffect(() => {
    // get all users other than authUser
    firebase.users().on('value', snapshot => {
      const usersObj = snapshot.val();

      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));

      const allUsers = usersArr
        .map(user => user.email)
        .filter(user => user !== authUser.email);
      dispatch({ type: 'SET_USERS', users: allUsers });
    });
  }, []);

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) {
        const messages = Object.values(snapshot.val());

        const filterByPersonToDm = messages.filter(
          message =>
            (message.user === authUser.email &&
              message.receiver === userToDm) ||
            (message.user === userToDm && message.receiver === authUser.email)
        );
        dispatch({ type: 'SET_CHAT', chat: filterByPersonToDm });
        alertSound.play();
      }
    };
    chatroom.on('value', handleNewMessages);
    return () => {
      chatroom.off('value', handleNewMessages);
    };
  }, [userToDm]);

  useEffect(() => {
    scrollToBottom();
  }, [chat, userToDm]);

  const scrollToBottom = () => {
    document.getElementById('bottom').scrollIntoView(false);
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const handleLayout = ({ user, message, timestamp, id }, idx) => {
    if (authUser.email === user) {
      return (
        <div
          key={id || idx}
          className="animated zoomIn d-flex flex-column align-items-end my-2">
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
        <div
          key={id || idx}
          className="animated zoomIn d-flex flex-column align-items-start my-2">
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

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_USER_TO_DM', userToDm: value });
  };

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
                  rooms={users}
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
                  {chat.length !== 0 ? (
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
            rooms={users}
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
