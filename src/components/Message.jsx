import React from 'react';
import MessageBody from './MessageBody';
import PropTypes from 'prop-types';

const User = ({ user }) => <div className="mb-1 user-name">{user}</div>;
const Time = ({ timestamp }) => <div className="mb-1 time">{timestamp}</div>;

const Message = ({ user, timestamp, message, color }) => {
  return (
    <>
      <User user={user} />
      <Time timestamp={timestamp} />
      <MessageBody body={message} color={color} />
    </>
  );
};

Message.propTypes = {
  user: PropTypes.string,
  timestamp: PropTypes.string,
  body: PropTypes.string,
  color: PropTypes.string
};

export default Message;
