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
  // if this is cleaned up it will trickle down.
  // invoke this immediately does not need to be used anywhere else
  (() => {
    destructuredMsg.forEach(word => {
      if (word.match(REGEX.urlPattern)) {
        matches.push({ url: word });
      }
      if (word.match(REGEX.imgUrlPattern)) {
        matches.push({ img: word });
      }
      if (word.match(REGEX.audioUrlPattern)) {
        matches.push({ audio: word });
      }
      if (word.match(REGEX.videoUrlPattern)) {
        matches.push({ video: word });
      }
    });
  })();

  // turn matches into JSX
  const doMatches = () => {
    const linksAsJSX = [];

    matches.forEach(match => {
      if (match.url) {
        linksAsJSX.push(
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
        linksAsJSX.push(
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
        linksAsJSX.push(
          <div>
            <audio controls>
              <source src={match.audio} type="audio/mpeg" />
            </audio>
          </div>
        );
      }

      if (match.video) {
        linksAsJSX.push(
          <div>
            <video className="msg-video img-thumbnail" controls>
              <source src={match.video} type="video/mp4" />
            </video>
          </div>
        );
      }
    });

    return linksAsJSX;
  };

  // create an array of only links
  const onlyLinks = () => {
    // returns array of arrays of links regardless of what kind to filter.
    let mappedLinks = matches.map(match => [...Object.values(match)]);
    // flatten array into one so it can be filtered against the other words in the message
    mappedLinks = mappedLinks.reduce((a, b) => [...a, ...b], []);
    return mappedLinks;
  };

  const messageWithoutLink = () => {
    // returns an array of links
    const links = onlyLinks();
    // filter array of words in destructuredMsg usings the links array as the comparison
    const message = destructuredMsg.filter(word => !links.includes(word));
    // returns the message without links
    return message;
  };
  // store in variables
  const matchesDone = doMatches();
  const noLinks = messageWithoutLink();

  // can now have multiple links in a message
  // media will stack on top of the words in the message.
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
