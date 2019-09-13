import React, { useEffect } from 'react';
import { withAuthorization } from '../components/Session';
import { INITIAL_STATE, reducer } from '../reducers/chatReducer';
import { useChat } from '../hooks/useChat';
import { useScroll } from '../hooks/useScroll';
import { User } from '../components/Message';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Message from '../components/Message';
import MessageForm from '../components/MessageForm';
import ChatList from '../components/ChatList';
import Container from '../components/common/Container';
import Search from '../components/Search';
import click from '../sounds/click.mp3';
const clickSound = new Audio(click);

const Home = ({ firebase }) => {
  const [
    { showChat, users, chat, room, roomList, usersInRoom },
    dispatch,
    authUser
  ] = useChat(reducer, INITIAL_STATE, firebase, 'chat');

  // destructure individual state values, dispatch, and authUser from useChat return array
  // initialize it with imported reducer and initial state, firebase prop, and type for effect switch.

  useEffect(() => {
    firebase
      .allRooms()
      .then(res => {
        dispatch({ type: 'SET_ROOM_LIST', roomList: res });
      })
      .catch(err => console.log(err));
  }, [dispatch, firebase]);

  useEffect(() => {
    const handleUsersInRoom = snapshot => {
      if (snapshot.val()) {
        const allUsers = Object.values(snapshot.val());

        const handleUsersInRoom = allUsers
          .filter(
            user =>
              user.username !== authUser.email && room === user.currentRoom
          )
          .map(user => user.username);

        dispatch({ type: 'SET_USERS_IN_ROOM', usersInRoom: handleUsersInRoom });
      }
    };
    firebase.typingRef().on('value', handleUsersInRoom);
    return () => {
      firebase.typingRef().off('value', handleUsersInRoom);
    };
  }, [authUser.email, dispatch, firebase, room]);

  // pass down scroll funcs as props from here, useScroll takes array to track and max length to stop smooth scroll
  const { scrollToBottom, scrollToTop } = useScroll(chat, 50);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_ROOM', room: value });
    clickSound.play();
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
          status={status ? status.online : null}
          message={message}
          user={user}
          timestamp={timestamp}
        />
      </div>
    );
  };

  const displayUsersInRoom = (user, index) => {
    const status = getOnlineStatus(user);

    return (
      <React.Fragment key={index}>
        <User className={`usersInRoom`} status={status} user={user}></User>
      </React.Fragment>
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
                    <h6 className="text-center">
                      current room: <p className="font-italic mt-2">{room}</p>
                    </h6>
                    <ChatList
                      rooms={roomList}
                      setChatRoom={setChatRoom}
                      currentRoom={room}
                    />
                    <button
                      className={`btn btn-${showChat} btn-block`}
                      onClick={() => dispatch({ type: 'TOGGLE_CHAT' })}>
                      {!showChat ? (
                        'Show Chat'
                      ) : (
                        <>
                          Search <span className="font-italic">{room}</span>
                        </>
                      )}
                    </button>
                    <>
                      {usersInRoom.length > 0 && roomList.length > 0 ? (
                        <div className="users-in-room-wrapper">
                          <p>users last seen here</p>
                          <hr />
                          {usersInRoom.map((user, index) =>
                            displayUsersInRoom(user, index)
                          )}
                          {/* <hr /> */}
                        </div>
                      ) : null}
                    </>
                  </div>
                </Column>
                <Column size="12 md-10">
                  <div className="wrapper">
                    <div id="spacer" />
                    <>
                      {chat.length > 0 && users.length > 0 ? (
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
                uid={authUser.uid}
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
            getOnlineStatus={getOnlineStatus}
            users={users}
          />
        </Container>
      )}
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
