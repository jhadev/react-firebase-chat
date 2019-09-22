import React from 'react';
import MessageBody from './MessageBody';
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
            <img src={avatar} alt={'avatar'} className={'avatar shadow'} />
          </a>
        </span>
      )}
    </>
  );
};

const Time = ({ timestamp }) => (
  <div className={`mb-1 mx-1 time`}>{timestamp}</div>
);

const Message = ({
  user,
  timestamp,
  message,
  color,
  avatar,
  status,
  search
}) => (
  <>
    <div className={`mb-1 mx-1 user-name`}>
      <User avatar={avatar} status={status} user={user} />
    </div>
    <Time timestamp={timestamp} />
    <MessageBody search={search || null} body={message} color={color} />
  </>
);

export { User, Time };

export default Message;
