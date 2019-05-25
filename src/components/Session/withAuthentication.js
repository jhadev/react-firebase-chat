import React from 'react';
import { withFirebase } from '../Firebase/index';
import { AuthUserContext } from './index';

const withAuthentication = Component => {
  class IsAuthenticated extends React.Component {
    state = { authUser: null };

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        authUser
          ? this.setState({ authUser })
          : this.setState({ authUser: null });
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(IsAuthenticated);
};

export default withAuthentication;
