import React, { useEffect } from 'react';
import { withAuthorization } from '../components/Session';
import { useForm } from '../hooks/formHook';
import AllUsers from '../components/AllUsers';
import ChatList from '../components/ChatList';
import RoomInput from '../components/RoomInput';
import Column from '../components/common/Column';
import Row from '../components/common/Row';
import Container from '../components/common/Container';
import * as ROLES from '../constants/roles';
import swal from '@sweetalert/with-react';

// only shown if authed
// admin page adds ability to see all users

const Admin = ({ firebase }) => {
  // this isn't only a form but why not use it anyway.
  const {
    formState: { loading, users, rooms, roomToAdd, roomToRemove },
    setFormState,
    onChange
  } = useForm({
    // set loading flag
    loading: false,
    // users set to empty array
    users: [],
    rooms: [],
    roomToAdd: '',
    roomToRemove: '',
    success: false
  });

  useEffect(() => {
    setFormState({ loading: true });
    // call firebase
    firebase.allRooms().then(res => {
      setFormState({ rooms: res });
    });

    const handleUsers = snapshot => {
      const usersObj = snapshot.val();
      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      setFormState({
        users: usersArr,
        loading: false
      });
    };
    firebase.users().on('value', handleUsers);
    return () => {
      firebase.users().off('value', handleUsers);
    };
  }, [firebase, setFormState]);

  const submitRoom = () => {
    if (rooms.includes(roomToAdd) || roomToAdd === '') {
      swal({
        content: <h4>Room already exists or room name is not defined</h4>,
        button: {
          text: 'Close',
          closeModal: true
        }
      });
    } else {
      firebase.send(roomToAdd.split(' ').join(''), roomToAdd).then(() => {
        swal({
          content: <h4>Success! {roomToAdd} has been added</h4>,
          button: {
            text: 'Close',
            closeModal: true
          }
        });
      });
    }
    firebase
      .allRooms()
      .then(res => {
        setFormState({ rooms: res, roomToAdd: '' });
      })
      .catch(err => console.log(err.message));
  };

  const removeRoom = () => {
    if (rooms.includes(roomToRemove)) {
      firebase
        .chat(roomToRemove)
        .remove()
        .then(() => {
          swal({
            content: <h4>Success! {roomToRemove} has been removed</h4>,
            button: {
              text: 'Close',
              closeModal: true
            }
          });
        })
        .catch(err => console.log(err.message));
    } else {
      swal({
        content: <h4>Room not found...</h4>,
        button: {
          text: 'Close',
          closeModal: true
        }
      });
    }
    firebase
      .allRooms()
      .then(res => {
        setFormState({ rooms: res, roomToRemove: '' });
      })
      .catch(err => console.log(err.message));
  };

  return (
    <Container>
      <h1 className="admin my-4 text-center">Admin Panel</h1>
      {loading && <div>Loading...</div>}
      <Row>
        <Column size="12">
          <AllUsers users={users} />
        </Column>
      </Row>
      <Row helper="my-3">
        <Column size="12 md-2">
          <p className="text-center">Chatrooms</p>
          <ChatList rooms={rooms} />
        </Column>
        <Column size="12 md-5">
          <RoomInput
            color="success"
            onChange={onChange}
            onSubmit={submitRoom}
            value={roomToAdd}
            add
          />
        </Column>
        <Column size="12 md-5">
          <RoomInput
            color="danger"
            onChange={onChange}
            onSubmit={removeRoom}
            value={roomToRemove}
          />
        </Column>
      </Row>
    </Container>
  );
};
//restrict route based on if user is authed and if they are identified as an admin
const condition = authUser =>
  authUser ? ROLES.ADMIN.includes(authUser.email) : false;

export default withAuthorization(condition)(Admin);
