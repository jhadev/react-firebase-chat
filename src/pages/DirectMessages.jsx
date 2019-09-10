import React, { useReducer, useContext, useEffect, useCallback } from 'react';
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
const alertSound = new Audio(alert);

const DirectMessages = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);

  const [{ users, chat, userToDm }, dispatch] = useReducer(
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
    const handleUsers = snapshot => {
      const usersObj = snapshot.val();
      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      const allUsers = usersArr
        .map(user => user.email)
        .filter(user => user !== authUser.email);
      dispatch({ type: 'SET_USERS', users: allUsers });
    };
    // get all users other than authUser
    firebase.users().on('value', handleUsers);
    return () => {
      firebase.users().off('value', handleUsers);
    };
  }, [authUser.email, firebase]);

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
    firebase.dms().on('value', handleNewMessages);
    return () => {
      firebase.dms().off('value', handleNewMessages);
    };
  }, [authUser.email, firebase, userToDm]);

  useEffect(() => {
    scrollToBottom();
  }, [chat, scrollToBottom]);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_USER_TO_DM', userToDm: value });
  };

  const handleLayout = ({ user, timestamp, message, id }, idx) => {
    return (
      <div
        key={id || idx}
        className={`animated ${
          authUser.email === user
            ? 'zoomInRight align-items-end'
            : 'zoomInLeft align-items-start'
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
