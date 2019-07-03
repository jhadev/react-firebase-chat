import React from 'react';

const Container = ({ fluid, children }) => (
  <div className={`container${fluid ? '-fluid' : ''}`}>{children}</div>
);

export default Container;
