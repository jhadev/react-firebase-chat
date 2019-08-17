import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import AuthUserContext from './context';
import { withFirebase } from '../Firebase/index';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => {
  const WithAuthorization = props => {
    useEffect(() => {
      const listener = props.firebase.auth.onAuthStateChanged(authUser => {
        //if auth fails send the user to the signin page
        if (!condition(authUser)) {
          //with history object of from react router
          props.history.push(ROUTES.SIGN_IN);
        }
      });
      return () => listener();
    }, [props.firebase.auth, props.history]);

    return (
      //consume auth user from the context
      //avoid showing protected page before the redirect using the higher order component
      <AuthUserContext.Consumer>
        {authUser => (condition(authUser) ? <Component {...props} /> : null)}
      </AuthUserContext.Consumer>
    );
  };

  return compose(
    withRouter,
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
