import React from 'react';
import MessageBody from './MessageBody';

const Message = ({ user, timestamp, message, color }) => {
  return (
    <>
      <div className="mb-1 user-name">{user}</div>
      <div className="mb-1 time">{timestamp}</div>
      <MessageBody body={message} color={color} />
    </>
  );
};

export default Message;
