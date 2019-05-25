import React from 'react';

const Row = ({ helper, children }) => (
  <div className={`row ${helper ? helper : ''}`}>{children}</div>
);

export default Row;
