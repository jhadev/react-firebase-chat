import React from 'react';
import MessageBody from './MessageBody';

const Message = ({ user, timestamp, message, color }) => {
  return (
    <>
      <div className="mt-4 user-name">{user}</div>
      <div className="mt-1 mb-2 time">{timestamp}</div>
      <MessageBody body={message} color={color} />
    </>
  );
};

export default Message;
