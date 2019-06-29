import React from 'react';
import * as REGEX from '../constants/regex';
import PropTypes from 'prop-types';
import './styles/components/message-body.scss';
import uuid from 'uuidv4';

const MessageBody = ({ body, color }) => {
  // extremely hacky
  let msgCopy = `${body}`;

  // if message contains spaces split at the space if it doesn't create an array with the single string
  const destructuredMsg =
    msgCopy.indexOf(' ') >= 0 ? msgCopy.split(' ') : [msgCopy];

  // will hold all the matched link, image, video, audio urls
  const matches = [];
  // find relevant matches and add them accordlingly i worked this out terrible but it is ok
  const checkForLinks = () => {
    destructuredMsg.forEach(word => {
      if (REGEX.urlPattern.test(word)) {
        matches.push({ url: word });
      }
      if (REGEX.imgUrlPattern.test(word)) {
        matches.push({ img: word });
      }
      if (REGEX.audioUrlPattern.test(word)) {
        matches.push({ audio: word });
      }
      if (REGEX.videoUrlPattern.test(word)) {
        matches.push({ video: word });
      }
    });
  };

  // run it
  checkForLinks();

  // turn matches into JSX
  const doMatches = () => {
    const innerHTML = [];

    matches.forEach(match => {
      if (match.url) {
        innerHTML.push(
          <a
            className="msg-link text-light"
            href={match.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {match.url}
          </a>
        );
      }

      if (match.img) {
        innerHTML.push(
          <a
            className="msg-link text-light"
            href={match.img}
            rel="noopener noreferrer"
            target="_blank"
          >
            <img
              className="msg-img img-fluid rounded img-thumbnail"
              src={match.img}
              alt="Message"
            />
          </a>
        );
      }

      if (match.audio) {
        innerHTML.push(
          <div>
            <audio controls>
              <source src={match.audio} type="audio/mpeg" />
            </audio>
          </div>
        );
      }

      if (match.video) {
        innerHTML.push(
          <div>
            <video className="msg-video img-thumbnail" controls>
              <source src={match.video} type="video/mp4" />
            </video>
          </div>
        );
      }
    });

    return innerHTML;
  };

  // create an array of only links
  const onlyLinks = () => {
    let mappedLinks = matches.map(match => [...Object.values(match)]);
    mappedLinks = mappedLinks.reduce((a, b) => a.concat(b), []);
    return mappedLinks;
  };

  const messageWithoutLink = () => {
    const links = onlyLinks();
    const message = destructuredMsg.filter(word => !links.includes(word));
    return message;
  };
  // store in variables
  const matchesDone = doMatches();
  const noLinks = messageWithoutLink();

  // can now have multiple links in a message
  return (
    <div className={`badge badge-${color} msgText mb-2`}>
      {matchesDone.length > 0
        ? matchesDone.map(match => <div key={uuid()}>{match}</div>)
        : null}
      {noLinks.length !== 0 && noLinks.join(' ')}
    </div>
  );
};

MessageBody.propTypes = {
  body: PropTypes.string,
  color: PropTypes.string
};

export default MessageBody;
