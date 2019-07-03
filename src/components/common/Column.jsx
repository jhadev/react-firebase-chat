import React from 'react';

const Column = props => {
  const size = props.size
    .split(' ')
    .map(colSize => `col-${colSize}`)
    .join(' ');

  return <div className={size} {...props} />;
};

export default Column;
