import React from 'react';
import MessageBody from './MessageBody';
import PropTypes from 'prop-types';
import './styles/components/message.scss';

const User = ({ user, search }) => (
  <div className={`mb-1 ${!search ? 'user-name' : 'user-search-name'}`}>
    {user}
  </div>
);
const Time = ({ timestamp, search }) => (
  <div className={`mb-1 ${!search ? 'time' : 'user-search-time'}`}>
    {timestamp}
  </div>
);

const Message = ({ user, timestamp, message, color, search }) => (
  <>
    <User search={search} user={user} />
    <Time search={search} timestamp={timestamp} />
    <MessageBody search={search} body={message} color={color} />
  </>
);

Message.propTypes = {
  user: PropTypes.string,
  timestamp: PropTypes.string,
  body: PropTypes.string,
  color: PropTypes.string
};

export default Message;
