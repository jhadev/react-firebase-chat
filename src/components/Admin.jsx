import React, { Component } from 'react';
import { withAuthorization } from '../components/Session/index';
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
    rooms: []
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

  render() {
    const { loading, users, rooms } = this.state;

    return (
      <div>
        <h1 className="admin my-4 text-center">Admin Panel</h1>
        {loading && <div>Loading...</div>}
        <Row>
          <Column size="2">
            <AllRooms rooms={rooms} />
          </Column>
          <Column size="10">
            <AllUsers users={users} />
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

const AllUsers = ({ users }) => {
  return (
    <Table striped responsive bordered>
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
