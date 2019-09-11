import React from 'react';
import MessageBody from './MessageBody';
import PropTypes from 'prop-types';
import './styles/components/message.scss';

// search prop is only necessary for alt way of handling search
const User = ({ user, search, status }) => (
  <div className={`mb-1 mx-1 ${!search ? 'user-name' : 'user-search-name'}`}>
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
const Time = ({ timestamp, search }) => (
  <div className={`mb-1 mx-1 ${!search ? 'time' : 'user-search-time'}`}>
    {timestamp}
  </div>
);

const Message = ({ user, timestamp, message, color, search, status }) => {
  console.log(status);
  return (
    <>
      <User search={search} status={status} user={user} />
      <Time search={search} timestamp={timestamp} />
      <MessageBody search={search} body={message} color={color} />
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
