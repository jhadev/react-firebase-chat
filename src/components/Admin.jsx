import React, { Component } from 'react';
import { withAuthorization } from '../components/Session/index';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import ChatList from '../components/ChatList';
import { Table } from 'reactstrap';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import * as ROLES from '../constants/roles';
import swal from '@sweetalert/with-react';

//only shown if authed
//admin page adds ability to see all users

class Admin extends Component {
  state = {
    //set loading flag
    loading: false,
    //users set to empty array
    users: [],
    rooms: [],
    roomToAdd: '',
    roomToRemove: ''
  };

  // need to add a way to update admin for new rooms without refresh
  //call firebase on mount
  componentDidMount() {
    //set loading to true
    this.setState({ loading: true });
    //call firebase
    this.props.firebase.allRooms().then(res => {
      this.setState({ rooms: res });
    });

    this.props.firebase.users().on('value', snapshot => {
      const usersObj = snapshot.val();

      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));
      this.setState({
        users: usersArr,
        loading: false
      });
    });
  }

  //remove listener on unmount
  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  handleInputChange = event => {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  };

  submitRoom = () => {
    const { roomToAdd, rooms } = this.state;
    if (rooms.includes(roomToAdd) || roomToAdd === '') {
      swal({
        content: <h4>Room already exists or room name is not defined</h4>,
        button: {
          text: 'Close',
          closeModal: true
        }
      });
    } else {
      this.props.firebase
        .send(roomToAdd.split(' ').join(''), roomToAdd)
        .then(() => {
          swal({
            content: <h4>Success! {roomToAdd} has been added</h4>,
            button: {
              text: 'Close',
              closeModal: true
            }
          });
        });
    }
    this.props.firebase
      .allRooms()
      .then(res => {
        this.setState({ rooms: res });
      })
      .catch(err => console.log(err.message));

    this.setState({ roomToAdd: '' });
  };

  removeRoom = () => {
    const { roomToRemove, rooms } = this.state;

    if (rooms.includes(roomToRemove)) {
      this.props.firebase
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
    this.props.firebase
      .allRooms()
      .then(res => {
        this.setState({ rooms: res });
      })
      .catch(err => console.log(err.message));

    this.setState({ roomToRemove: '' });
  };

  render() {
    const { loading, users, rooms, roomToAdd, roomToRemove } = this.state;

    console.log(rooms);

    return (
      <div>
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
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="success" onClick={this.submitRoom}>
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
                  onChange={this.handleInputChange}
                />
                <InputGroupAddon addonType="append">
                  <Button color="danger" onClick={this.removeRoom}>
                    Remove
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </>
          </Column>
        </Row>
      </div>
    );
  }
}

const AllUsers = ({ users }) => {
  return (
    <Table className="mb-3" striped responsive bordered>
      <thead>
        <tr>
          <th>#</th>
          <th>UID</th>
          <th>Username</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, index) => (
          <tr key={user.uid}>
            <th scope="row">{index + 1}</th>
            <td>{user.uid}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

//restrict route based on if user is authed and if they are identified as an admin
const condition = authUser =>
  authUser ? ROLES.ADMIN.includes(authUser.email) : false;

export default withAuthorization(condition)(Admin);
