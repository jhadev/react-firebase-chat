import React, { useReducer, useContext, useEffect } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import { INITIAL_STATE, reducer } from '../reducers/dmReducer';
import { useScroll } from '../hooks/useScroll';
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

  useEffect(() => {
    const handleUsers = snapshot => {
      const usersObj = snapshot.val();
      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      const allUsers = usersArr;

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

  const { scrollToBottom, scrollToTop } = useScroll(chat, 50);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_USER_TO_DM', userToDm: value });
  };

  const handleDmList = arr => {
    return arr.filter(email => email !== authUser.email);
  };

  const getOnlineStatus = args => {
    if (users) {
      const findUser = users.find(user => user.email === args);
      return findUser;
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

  const usersList = handleDmList(users);
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
            rooms={usersList}
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
