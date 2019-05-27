import React from 'react';
import * as REGEX from '../constants/regex';
import PropTypes from 'prop-types';

const MessageBody = ({ body, color }) => {
  let msgBody = (
    <div className={`badge badge-${color} msgText mb-2`}>{body}</div>
  );
  //extremely hacky
  let fakedMsg = ` ${body}`;
  const destructuredMsg = fakedMsg.split(' ');

  // easier to read
  const textWithoutLink = (arr, input) => {
    return arr.filter(string => string !== input).join(' ');
  };

  destructuredMsg.forEach(word => {
    if (REGEX.urlPattern.test(word)) {
      msgBody = (
        <div className={`badge badge-${color} msgText mb-2`}>
          <a
            className="msg-link text-light"
            href={word}
            rel="noopener noreferrer"
            target="_blank"
          >
            {word}
          </a>
          {textWithoutLink(destructuredMsg, word)}
        </div>
      );
    } else if (REGEX.imgUrlPattern.test(word)) {
      msgBody = (
        <div className={`badge badge-${color} msgText msgImg mb-2`}>
          <a
            className="msg-link text-light"
            href={word}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className="msg-img img-fluid rounded img-thumbnail"
              src={word}
              alt="Message"
            />
          </a>
          {textWithoutLink(destructuredMsg, word)}
        </div>
      );
    } else if (REGEX.audioUrlPattern.test(word)) {
      msgBody = (
        <div className={`badge badge-${color} msgText msgImg mb-2`}>
          <div>
            <audio controls>
              <source src={word} type="audio/mpeg" />
            </audio>
          </div>
          <div>{textWithoutLink(destructuredMsg, word)}</div>
        </div>
      );
    } else if (REGEX.videoUrlPattern.test(word)) {
      msgBody = (
        <div className={`badge badge-${color} msgText msgImg mb-2`}>
          <div>
            <video className="msg-video img-thumbnail" controls>
              <source src={word} type="video/mp4" />
            </video>
          </div>
          <div>{textWithoutLink(destructuredMsg, word)}</div>
        </div>
      );
    } else {
      return msgBody;
    }
  });

  return msgBody;
};

MessageBody.propTypes = {
  body: PropTypes.string,
  color: PropTypes.string
};

export default MessageBody;
