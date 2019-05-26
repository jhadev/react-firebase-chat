import React from 'react';

const MessageBody = ({ body, badgeClass }) => {
  const urlPattern = /(?!.*(?:\.jpe?g|\/iframe>|\.gif|\.png|\.mp4|\.mp3)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#%?=~_|!:,.;]*[a-z0-9-+&@#%=~_|]/gim;
  const imgUrlPattern = /(?=.*(?:\.jpe?g|\.gif|\.png)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#%?=~_|!:,.;]*[a-z0-9-+&@#%=~_|]/gim;
  const videoUrlPattern = /(?=.*(?:\.mp4|\.ogg)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  const audioUrlPattern = /(?=.*(?:\.mp3)$)\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim;
  let newMsg;
  const destructuredMsg = body.split(' ');
  destructuredMsg.forEach(word => {
    if (urlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${badgeClass} msgText mb-2`}>
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
    } else if (imgUrlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${badgeClass} msgText msgImg mb-2`}>
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
    } else if (audioUrlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${badgeClass} msgText msgImg mb-2`}>
          <div>
            <audio controls>
              <source src={word} type="audio/mpeg" />
            </audio>
          </div>
          <div>{destructuredMsg.join(' ')}</div>
        </div>
      );
    } else if (videoUrlPattern.test(word)) {
      newMsg = (
        <div className={`badge badge-${badgeClass} msgText msgImg mb-2`}>
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
        <div className={`badge badge-${badgeClass} msgText mb-2`}>{body}</div>
      );
    }
  });

  return newMsg;
};

export default MessageBody;
