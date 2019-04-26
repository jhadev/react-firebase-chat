import React, { Component } from "react";
import { withAuthorization } from "../components/Session/index";

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
        <h1 className="admin my-4">Admin</h1>
        {loading && <div>Loading...</div>}

        <AllUsers users={users} />
      </div>
    );
  }
}
//start users component

const AllUsers = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <li key={user.uid}>
          <span>
            <strong>ID: </strong>
            {`${user.uid} `}
          </span>
          <span>
            <strong>E-Mail: </strong>
            {`${user.email} `}
          </span>
          <span>
            <strong>Username: </strong> {`${user.username} `}
          </span>
        </li>
      ))}
    </ul>
  );
};

const condition = authUser => !!authUser;

export default withAuthorization(condition)(Admin);
