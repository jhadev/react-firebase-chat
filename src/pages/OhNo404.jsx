import React from 'react';
import Container from '../components/common/Container';
import Row from '../components/common/Row';
import Column from '../components/common/Column';
import uhoh from '../images/404error.gif';

const OhNo404 = props => {
  return (
    <Container>
      <Row helper={'justify-content-center'}>
        <Column size={'md-6 12'}>
          <img className="img-fluid" src={uhoh} alt="404" />
        </Column>
      </Row>
    </Container>
  );
};

export default OhNo404;
