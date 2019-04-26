import React, { Component } from "react";
import { withAuthorization } from "../components/Session/index";
import { Table } from "reactstrap";
import * as ROLES from "../constants/roles";

//only shown if authed
//admin page adds ability to see all users

class Admin extends Component {
  state = {
    //set loading flag
    loading: false,
    //users set to empty array
    users: []
  };

  //call firebase on mount
  componentDidMount() {
    //set loading to true
    this.setState({ loading: true });
    //call firebase
    this.props.firebase.users().on("value", snapshot => {
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
    const { loading, users } = this.state;

    return (
      <div>
        <h1 className="admin my-4 text-center">Admin Panel</h1>
        {loading && <div>Loading...</div>}

        <AllUsers users={users} />
      </div>
    );
  }
}
//start users component

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

const condition = authUser =>
  authUser ? authUser.email === ROLES.ADMIN : false;

export default withAuthorization(condition)(Admin);
