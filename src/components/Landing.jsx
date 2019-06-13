import React, { useContext } from 'react';
import Row from './common/Row';
import Column from './common/Column';
import AuthUserContext from './Session/context';
import { Redirect } from 'react-router-dom';
import * as ROUTES from '../constants/routes';
import SignIn from './SignIn';

const Landing = () => {
  const authUser = useContext(AuthUserContext);

  if (authUser) {
    return <Redirect to={ROUTES.HOME} />;
  } else {
    return (
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
    );
  }
};

export default Landing;
