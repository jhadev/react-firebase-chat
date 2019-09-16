import React, { useEffect, useRef } from 'react';
import { withAuthorization } from '../components/Session';
import { INITIAL_STATE, reducer } from '../reducers/chatReducer';
import { useChat } from '../hooks/useChat';
import { useScroll } from '../hooks/useScroll';
import { User } from '../components/Message';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import MessageForm from '../components/MessageForm';
import ChatList from '../components/ChatList';
import Container from '../components/common/Container';
import Search from '../components/Search';
import click from '../sounds/click.mp3';
const clickSound = new Audio(click);

const Home = ({ firebase }) => {
  // destructure individual state values, dispatch, and authUser from useChat return array
  // initialize it with imported reducer and initial state, firebase prop, and type for effect switch.

  const bottomRef = useRef();

  const [
    { showChat, users, chat, room, roomList, usersInRoom },
    dispatch,
    authUser,
    handleLayout,
    getUserDetails
  ] = useChat(reducer, INITIAL_STATE, firebase, 'chat');

  useEffect(() => {
    // get all rooms
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
        // only see users that aren't authUser and are in the current room.
        const usersInRoom = allUsers
          .filter(({ username, currentRoom }) => {
            return username !== authUser.email && room === currentRoom;
          })
          .map(({ username, uid }) => ({ username, uid }));

        dispatch({ type: 'SET_USERS_IN_ROOM', usersInRoom });
      }
    };
    firebase.typingRef().on('value', handleUsersInRoom);
    return () => {
      firebase.typingRef().off('value', handleUsersInRoom);
    };
  }, [authUser.email, dispatch, firebase, room]);

  // pass down scroll funcs as props from here, useScroll takes array to track and max length to stop smooth scroll
  const { scrollToBottom, scrollToTop } = useScroll(chat, 50, bottomRef);

  const setChatRoom = event => {
    const { value } = event.target;
    dispatch({ type: 'SET_ROOM', room: value });
    // save room on switch to load it into state on boot
    localStorage.setItem('room', value);
    clickSound.play();
  };

  // map over users that were last seen in the current room in the return
  const displayUsersInRoom = ({ username, uid }) => {
    const details = getUserDetails(username);

    // FIXME: this is temp don't forget it.
    if (username.length > 20) {
      username = username.split('@').join(' @');
    }

    return (
      <div key={username} className={'usersInRoom'}>
        <User
          avatar={details ? details.avatar : null}
          status={details ? details.online : null}
          user={username}
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
                          {usersInRoom.map(user => displayUsersInRoom(user))}
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
          <div ref={bottomRef} id="bottom" />
        </>
      ) : (
        <Container>
          <Search
            showChat={showChat}
            dispatch={dispatch}
            room={room}
            chat={chat}
            getUserDetails={getUserDetails}
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
