import React, { useState, useEffect } from 'react';
import { withFirebase } from '../Firebase/index';
import { AuthUserContext } from './index';

const withAuthentication = Component => {
  const IsAuthenticated = props => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
      const listener = props.firebase.auth.onAuthStateChanged(authUser => {
        authUser ? setAuthUser(authUser) : setAuthUser(null);
      });
      return () => listener();
    }, [authUser, props.firebase.auth]);

    return (
      <AuthUserContext.Provider value={authUser}>
        <Component {...props} />
      </AuthUserContext.Provider>
    );
  };

  return withFirebase(IsAuthenticated);
};

export default withAuthentication;
