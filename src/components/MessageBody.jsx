import React from 'react';
import * as REGEX from '../constants/regex';
import PropTypes from 'prop-types';
import './styles/components/message-body.scss';

const MessageBody = ({ body, color }) => {
  let msgBody = (
    <div className={`badge badge-${color} msgText mb-2`}>{body}</div>
  );

  //extremely hacky
  let msgCopy = `${body}`;

  let urls = [];

  // if message contains spaces split at the space if it doesn't create an array with the single string
  const destructuredMsg =
    msgCopy.indexOf(' ') >= 0 ? msgCopy.split(' ') : [msgCopy];

  // easier to read takes in array of words and filters the array so it returns a new array without the matched regex link and turns it back into a string at the space
  const textWithoutLink = (arr, input) => {
    return arr.filter(string => string !== input).join(' ');
  };

  // this will only work for one match and return the entire component. still need to figure out how to handle multiple matches.
  destructuredMsg.forEach(word => {
    if (REGEX.urlPattern.test(word)) {
      urls.push(word);
      console.log(urls);
    }
    switch (true) {
      case REGEX.urlPattern.test(word):
        msgBody = (
          <div className={`badge badge-${color} msgText mb-2`}>
            <a
              className="msg-link text-light"
              href={word}
              rel="noopener noreferrer"
              target="_blank"
            >
              {word}
            </a>{' '}
            {textWithoutLink(destructuredMsg, word)}
          </div>
        );
        break;
      case REGEX.imgUrlPattern.test(word):
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
        break;
      case REGEX.audioUrlPattern.test(word):
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
        break;
      case REGEX.videoUrlPattern.test(word):
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
        break;
      default:
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
