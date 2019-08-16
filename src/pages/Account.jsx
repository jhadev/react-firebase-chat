import React, { useContext } from 'react';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/PasswordChange';
import { withAuthorization } from '../components/Session/index';
import AuthUserContext from '../components/Session/context';

const Account = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <div>
      <div className="mb-4">
        <h1 className="my-4 text-center">Account Options</h1>
        <h4 className="text-center">
          Your account: <strong>{authUser.email}</strong>
        </h4>
      </div>
      <PasswordForgetForm />
      <PasswordChangeForm />
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, account page is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
