import React from 'react';

const Container = ({ fluid, children }) => (
  <div className={`container${fluid || ''}`}>{children}</div>
);

export default Container;
