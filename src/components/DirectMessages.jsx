/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from 'react';
import AuthUserContext from '../components/Session/context';
import { withAuthorization } from '../components/Session/index';
import ChatList from './ChatList';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';

const DirectMessages = props => {
  const authUser = useContext(AuthUserContext);
  // all users in state
  const [users, setUsers] = useState([]);
  // user to DM
  const [userToDm, setUserToDm] = useState('');

  // get all users other than authUser

  useEffect(() => {
    props.firebase.users().on('value', snapshot => {
      const usersObj = snapshot.val();

      const usersArr = Object.keys(usersObj).map(key => ({
        ...usersObj[key],
        uid: key
      }));

      const allUsers = usersArr
        .map(user => user.email)
        .filter(user => user !== authUser.email);
      setUsers(allUsers);
    });
  }, []);

  /* 
  TO DO

  on selection of a user to dm, pull firebase dms table and filter by user and receiver
  hold it in state

  import MessageForm and modify props to support a flag that allows adding a receiver to the sent object

  pull layout func from Home to display the messages
  */

  console.log(users);
  console.log(authUser.email);
  console.log(userToDm);

  return (
    <div className="white-space">
      <Container>
        <Row helper="mt-4">
          <Column size="12 md-3">
            <div className="sticky-top">
              <div id="spacer" />
              <h6>Users to DM</h6>
              <ChatList
                rooms={users}
                setChatRoom={setUserToDm}
                currentRoom={userToDm}
                dms
              />
            </div>
          </Column>
        </Row>
      </Container>
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(DirectMessages);
