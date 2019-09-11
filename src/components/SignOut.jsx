import React from 'react';
import { withFirebase } from './Firebase/index';

const SignOut = ({ firebase }) => {
  const uid = localStorage.getItem('uid');

  return (
    <div
      className="nav-link navStyle signOut"
      onClick={() => firebase.doSignOutUser({ uid })}>
      Sign Out
    </div>
  );
};

export default withFirebase(SignOut);
