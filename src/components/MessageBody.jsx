import React from 'react';
import * as REGEX from '../constants/regex';

const MessageBody = ({ body, color }) => {
  let newMsg;

  const destructuredMsg = body.split(' ');
  console.log(destructuredMsg);
  destructuredMsg.forEach(word => {
    if (REGEX.urlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${color} msgText mb-2`}>
          <a
            className="msg-link text-light"
            href={word}
            rel="noopener noreferrer"
            target="_blank"
          >
            {destructuredMsg.join(' ')}
          </a>
        </div>
      );
    } else if (REGEX.imgUrlPattern.test(word)) {
      newMsg = (
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
          {destructuredMsg.join(' ')}
        </div>
      );
    } else if (REGEX.audioUrlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${color} msgText msgImg mb-2`}>
          <div>
            <audio controls>
              <source src={word} type="audio/mpeg" />
            </audio>
          </div>
          <div>{destructuredMsg.join(' ')}</div>
        </div>
      );
    } else if (REGEX.videoUrlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${color} msgText msgImg mb-2`}>
          <div>
            <video className="msg-video img-thumbnail" controls>
              <source src={word} type="video/mp4" />
            </video>
          </div>
          <div>{destructuredMsg.join(' ')}</div>
        </div>
      );
    } else {
      newMsg = (
        <div className={`badge badge-${color} msgText mb-2`}>{body}</div>
      );
    }
  });

  return newMsg;
};

export default MessageBody;
