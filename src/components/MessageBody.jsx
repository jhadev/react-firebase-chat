import React from 'react';
import * as REGEX from '../constants/regex';
import PropTypes from 'prop-types';
import { Audio, Image, Link, Video } from './Matching';
import './styles/components/message-body.scss';
import uuid from 'uuidv4';

const MessageBody = ({ body, color }) => {
  // extremely hacky
  const msgCopy = `${body}`;

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
    const linksAsJSX = matches.map(match => {
      if (match.url) {
        return <Link url={match.url}>{match.url}</Link>;
      }

      if (match.img) {
        return (
          <Link url={match.img}>
            <Image url={match.img} />
          </Link>
        );
      }

      if (match.audio) {
        return <Audio url={match.audio} />;
      }

      if (match.video) {
        return <Video url={match.video} />;
      }

      return match;
    });

    return linksAsJSX;
  };

  // create an array of only links
  const onlyLinks = () => {
    // returns array of arrays of links regardless of what kind to filter.
    const mappedLinks = matches.map(match => [...Object.values(match)]);
    // flatten array into one so it can be filtered against the other words in the message
    return mappedLinks.reduce((a, b) => [...a, ...b], []);
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
      {matchesDone.length
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
