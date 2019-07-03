import React from 'react';
import { withFirebase } from './Firebase/index';

const SignOut = ({ firebase }) => (
  <div className="nav-link navStyle signOut" onClick={firebase.doSignOutUser}>
    Sign Out
  </div>
);

export default withFirebase(SignOut);
