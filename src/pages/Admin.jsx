import React, { useEffect } from 'react';
import Switch from 'react-switch';
import { withAuthorization } from '../components/Session';
import { useForm } from '../hooks/useForm';
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
  const { formState, setFormState, mapInputs } = useForm({
    // set loading flag
    loading: false,
    // users set to empty array
    users: [],
    rooms: [],
    room: '',
    isAdd: true
  });

  const { users, rooms, room, isAdd, loading } = formState;

  const formOptions = [
    {
      placeholder: `${isAdd ? 'add room' : 'remove room'}`,
      type: 'text',
      className: 'form-control'
    }
  ];

  const displayInputs = mapInputs(formState, ['room'])(formOptions);

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
    if (isAdd && rooms.includes(room)) {
      swal({
        content: <h4>Room already exists or room name is not defined</h4>,
        button: {
          text: 'Close',
          closeModal: true
        }
      });
    } else if (!isAdd && !rooms.includes(room)) {
      swal({
        content: <h4>Room not found...</h4>,
        button: {
          text: 'Close',
          closeModal: true
        }
      });
    } else if (isAdd && !rooms.includes(room)) {
      firebase.send(room.split(' ').join(''), room).then(() => {
        swal({
          content: <h4>Success! {room} has been added</h4>,
          button: {
            text: 'Close',
            closeModal: true
          }
        });
        getRooms();
      });
    } else if (!isAdd && rooms.includes(room)) {
      firebase
        .chat(room)
        .remove()
        .then(() => {
          swal({
            content: <h4>Success! {room} has been removed</h4>,
            button: {
              text: 'Close',
              closeModal: true
            }
          });
          getRooms();
        })
        .catch(err => console.log(err.message));
    }
  };

  const getRooms = () => {
    firebase
      .allRooms()
      .then(res => {
        setFormState({ rooms: res, room: '' });
      })
      .catch(err => console.log(err.message));
  };

  const toggle = value => {
    setFormState({ isAdd: value });
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
      <Row helper="my-2">
        <Column size="12 md-2">
          <p className="text-center">Chatrooms</p>
          <ChatList rooms={rooms} />
        </Column>
        <Column size="12 md-10">
          <h3 className="text-center">Manage Rooms</h3>
          <Row helper="justify-content-center my-4">
            <div className="form-row align-items-center">
              <div className="col-auto">
                <label className="my-1 mx-2" htmlFor="room-switch">
                  <Switch
                    checked={isAdd}
                    onChange={toggle}
                    onColor="#28a745"
                    onHandleColor="#ebedeb"
                    handleDiameter={16}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                    activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                    height={20}
                    width={40}
                    className="react-switch align-middle"
                    id="room-switch"
                  />
                </label>
              </div>
              <div className="col-auto">{displayInputs}</div>
              <div className="col-auto">
                <button
                  className={`btn btn-${isAdd ? 'success' : 'danger'}`}
                  disabled={room === ''}
                  onClick={submitRoom}>
                  {isAdd ? (
                    <i className="fas fa-check"></i>
                  ) : (
                    <i className="fas fa-times"></i>
                  )}
                </button>
              </div>
            </div>
          </Row>
        </Column>
      </Row>
    </Container>
  );
};
//restrict route based on if user is authed and if they are identified as an admin
const condition = authUser =>
  authUser ? ROLES.ADMIN.includes(authUser.email) : false;

export default withAuthorization(condition)(Admin);
