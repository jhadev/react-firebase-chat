import React from 'react';
import { Table } from 'reactstrap';

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

export default AllUsers;
