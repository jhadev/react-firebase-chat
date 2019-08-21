import React, { useEffect } from 'react';
import { withAuthorization } from '../components/Session/index';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import { useForm } from '../hooks/formHook';
import AllUsers from '../components/AllUsers';
import ChatList from '../components/ChatList';
import Column from '../components/common/Column';
import Row from '../components/common/Row';
import Container from '../components/common/Container';
import * as ROLES from '../constants/roles';
import swal from '@sweetalert/with-react';

// only shown if authed
// admin page adds ability to see all users

const Admin = ({ firebase }) => {
  // this isn't only a form but why not use it anyway.
  const { formState, setFormState, onChange } = useForm({
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

    firebase.users().on('value', snapshot => {
      const usersObj = snapshot.val();

      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      setFormState({
        users: usersArr,
        loading: false
      });
    });
    return () => firebase.users().off();
  }, [firebase, setFormState]);

  const submitRoom = () => {
    const { roomToAdd, rooms } = formState;
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
        setFormState({ rooms: res });
      })
      .catch(err => console.log(err.message));

    setFormState({ roomToAdd: '' });
  };

  const removeRoom = () => {
    const { roomToRemove, rooms } = formState;

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
        setFormState({ rooms: res });
      })
      .catch(err => console.log(err.message));

    setFormState({ roomToRemove: '' });
  };

  const { loading, users, rooms, roomToAdd, roomToRemove } = formState;

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
          {/* ADD ROOM */}
          <>
            <h3 className="text-center my-3">Add Room</h3>
            <InputGroup>
              <Input
                placeholder="add a room"
                name="roomToAdd"
                value={roomToAdd}
                onChange={onChange}
              />
              <InputGroupAddon addonType="append">
                <Button color="success" onClick={submitRoom}>
                  Add
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </>
        </Column>
        <Column size="12 md-5">
          {/* REMOVE ROOM */}
          <>
            <h3 className="text-center my-3">Remove Room</h3>
            <InputGroup>
              <Input
                placeholder="remove a room"
                name="roomToRemove"
                value={roomToRemove}
                onChange={onChange}
              />
              <InputGroupAddon addonType="append">
                <Button color="danger" onClick={removeRoom}>
                  Remove
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </>
        </Column>
      </Row>
    </Container>
  );
};
//restrict route based on if user is authed and if they are identified as an admin
const condition = authUser =>
  authUser ? ROLES.ADMIN.includes(authUser.email) : false;

export default withAuthorization(condition)(Admin);
