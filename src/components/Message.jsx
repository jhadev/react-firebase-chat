import React from 'react';
import MessageBody from './MessageBody';
import PropTypes from 'prop-types';
import './styles/components/message.scss';

const User = ({ user, status, avatar }) => {
  return (
    <>
      <span>
        {status ? (
          <i className="fas fa-circle"></i>
        ) : (
          <i className="far fa-circle"></i>
        )}
        {'  '}
      </span>
      {user}
      {avatar && (
        <span>
          <a href={avatar} rel="noopener noreferrer" target="_blank">
            <img src={avatar} alt={'avatar'} className={'avatar'} />
          </a>
        </span>
      )}
    </>
  );
};

const Time = ({ timestamp }) => (
  <div className={`mb-1 mx-1 time`}>{timestamp}</div>
);

const Message = ({ user, timestamp, message, color, avatar, status }) => (
  <>
    <div className={`mb-1 mx-1 user-name`}>
      <User avatar={avatar} status={status} user={user} />
    </div>
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

export { User, Time };

export default Message;
