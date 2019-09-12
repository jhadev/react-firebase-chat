import React from 'react';
import MessageBody from './MessageBody';
import PropTypes from 'prop-types';
import './styles/components/message.scss';

const User = ({ user, status }) => (
  <div className={`mb-1 mx-1 user-name`}>
    <span>
      {status ? (
        <i className="fas fa-circle"></i>
      ) : (
        <i className="far fa-circle"></i>
      )}
      {'  '}
    </span>
    {user}
  </div>
);

const Time = ({ timestamp }) => (
  <div className={`mb-1 mx-1 time`}>{timestamp}</div>
);

const Message = ({ user, timestamp, message, color, status }) => (
  <>
    <User status={status} user={user} />
    <Time timestamp={timestamp} />
    <MessageBody body={message} color={color} />
  </>
);

Message.propTypes = {
  user: PropTypes.string,
  timestamp: PropTypes.string,
  body: PropTypes.string,
  color: PropTypes.string
};

export default Message;
