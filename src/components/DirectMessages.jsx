/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import uuid from 'uuidv4';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import ChatList from './ChatList';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';
import Message from './Message';
import MessageForm from './MessageForm';
import alert from '../sounds/sent.mp3';

const DirectMessages = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);
  // all users in state
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState([]);
  // user to DM
  const [userToDm, setUserToDm] = useState('');
  const chatroom = firebase.dms();
  // get all users other than authUser

  const alertSound = new Audio(alert);

  useEffect(() => {
    firebase.users().on('value', snapshot => {
      const usersObj = snapshot.val();

      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));

      const allUsers = usersArr
        .map(user => user.email)
        .filter(user => user !== authUser.email);
      setUsers(allUsers);
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
        setChat(filterByPersonToDm);
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

  const handleLayout = ({ user, message, timestamp }) => {
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

  const setChatRoom = event => {
    const { value } = event.target;
    setUserToDm(value);
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
                  setChatRoom={setUserToDm}
                  currentRoom={userToDm}
                  dms
                />
              </div>
              {/* <button onClick={sendDm}>Test send</button> */}
            </Column>
            <Column size="12 md-9">
              <div className="wrapper">
                <div id="spacer" />
                <div className="mt-5">
                  {chat.length !== 0 ? (
                    chat.map(message => handleLayout(message))
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
