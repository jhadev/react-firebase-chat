import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import { AuthUserContext } from '../components/Session';
import SignIn from './SignIn';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import Container from '../components/common/Container';

const Landing = () => {
  const authUser = useContext(AuthUserContext);

  if (authUser) {
    return <Redirect to={ROUTES.HOME} />;
  }

  return (
    <Container>
      <div className="text-center my-2">
        <h1>Welcome</h1>
        <Row helper="my-4">
          <Column size="12">
            <div className="main">
              <h3>something will go here {':)'}</h3>
              <SignIn />
            </div>
          </Column>
        </Row>
      </div>
    </Container>
  );
};

export default Landing;
