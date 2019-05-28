import React, { Component } from 'react';
import { withAuthorization } from '../components/Session/index';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import { Table } from 'reactstrap';
import * as ROLES from '../constants/roles';

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
    if (rooms.includes(roomToAdd)) {
      alert('room already exists');
    } else {
      this.props.firebase.send(roomToAdd.split(' ').join(''), roomToAdd);
    }
    this.setState({ roomToAdd: '' });
    this.props.firebase
      .allRooms()
      .then(res => {
        this.setState({ rooms: res });
      })
      .catch(err => console.log(err.message));
  };

  removeRoom = () => {
    const { roomToRemove, rooms } = this.state;

    if (rooms.includes(roomToRemove)) {
      this.props.firebase
        .chat(roomToRemove)
        .remove()
        .then(() => {
          alert(`${roomToRemove} has been removed`);
        })
        .catch(err => console.log(err.message));
    } else {
      alert('room not found');
    }
    this.setState({ roomToRemove: '' });
    this.props.firebase
      .allRooms()
      .then(res => {
        this.setState({ rooms: res });
      })
      .catch(err => console.log(err.message));
  };
  render() {
    const { loading, users, rooms, roomToAdd, roomToRemove } = this.state;

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
            <AllRooms rooms={rooms} />
          </Column>
          <Column size="12 md-5">
            <AddRoom
              handleInputChange={this.handleInputChange}
              roomToAdd={roomToAdd}
              rooms={rooms}
              submitRoom={this.submitRoom}
            />
          </Column>
          <Column size="12 md-5">
            <RemoveRoom
              handleInputChange={this.handleInputChange}
              roomToRemove={roomToRemove}
              rooms={rooms}
              removeRoom={this.removeRoom}
            />
          </Column>
        </Row>
      </div>
    );
  }
}
//start users component

const AllRooms = ({ rooms }) => {
  return (
    <div className="text-center">
      <p>All Rooms</p>
      <ul className="list-group">
        {rooms.map(room => (
          <li key={room} className="list-group-item">
            {room}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AddRoom = ({ handleInputChange, roomToAdd, submitRoom }) => {
  return (
    <>
      <h3 className="text-center my-3">Add Room</h3>
      <InputGroup>
        <Input
          placeholder="add a room"
          name="roomToAdd"
          value={roomToAdd}
          onChange={handleInputChange}
        />
        <InputGroupAddon addonType="append">
          <Button color="success" onClick={submitRoom}>
            Add Room
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

const RemoveRoom = ({ handleInputChange, roomToRemove, removeRoom }) => {
  return (
    <>
      <h3 className="text-center my-3">Remove Room</h3>
      <InputGroup>
        <Input
          placeholder="remove a room"
          name="roomToRemove"
          value={roomToRemove}
          onChange={handleInputChange}
        />
        <InputGroupAddon addonType="append">
          <Button color="danger" onClick={removeRoom}>
            Remove Room
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

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
