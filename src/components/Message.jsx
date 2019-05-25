import React from 'react';

const Message = ({ children, user, timestamp }) => {
  return (
    <>
      <div className="mt-4 user-name">{user}</div>
      <div className="my-1 time">{timestamp}</div>
      {children}
    </>
  );
};

export default Message;
