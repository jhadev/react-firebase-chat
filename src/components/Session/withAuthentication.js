import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase/index';
import { AuthUserContext } from './index';

const withAuthentication = Component => {
  const IsAuthenticated = props => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      const listener = props.firebase.auth.onAuthStateChanged(authUser => {
        if (authUser) {
          props.firebase.setOnlineStatus(authUser, true);
          localStorage.setItem('uid', authUser.uid);
          setAuthUser({ ...authUser, online: true });
        } else {
          // const uid = localStorage.getItem('uid');
          // const uidObj = { uid };
          // console.log(uidObj);
          // props.firebase.setOnlineStatus(uidObj, false);
          setAuthUser(null);
        }
      });
      return () => listener();
    }, [props.firebase]);

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return withFirebase(IsAuthenticated);
};

export default withAuthentication;
