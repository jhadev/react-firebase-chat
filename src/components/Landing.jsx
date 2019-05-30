import React from 'react';
import Row from './common/Row';
import Column from './common/Column';

const Landing = () => (
  <div className="text-center my-2">
    <h1>Welcome</h1>
    <Row helper="my-4">
      <Column size="12">
        <div className="main">
          <h3>something will go here {':)'}</h3>
        </div>
      </Column>
    </Row>
  </div>
);

export default Landing;
