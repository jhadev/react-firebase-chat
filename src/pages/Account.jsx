import React, { useContext } from 'react';
import Container from '../components/common/Container';
import { PasswordForgetForm } from './PasswordForget';
import PasswordChangeForm from '../components/PasswordChange';
import { withAuthorization } from '../components/Session';
import { AuthUserContext } from '../components/Session';
import AvatarForm from '../components/AvatarForm';

const Account = () => {
  const authUser = useContext(AuthUserContext);

  return (
    <Container>
      <div className="mb-4">
        <h1 className="my-4 text-center">Account Options</h1>
        <h4 className="text-center">
          Your account: <strong>{authUser.email}</strong>
        </h4>
      </div>
      <PasswordForgetForm />
      <PasswordChangeForm />
      <AvatarForm />
    </Container>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, account page is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
