/* eslint-disable no-useless-escape */
import React from 'react';
import * as REGEX from '../constants/regex';
import { Audio, Image, Link, Video, YouTube } from './Matching';
import './styles/components/message-body.scss';

const MessageBody = ({ body, color, search }) => {
  // extremely hacky
  const msgCopy = `${body}`;

  // if message contains spaces split at the space if it doesn't create an array with the single string
  const destructuredMsg =
    msgCopy.indexOf(' ') >= 0 ? msgCopy.split(' ') : [msgCopy];

  // will hold all the matched link, image, video, audio urls
  const matches = [];

  const getYouTubeID = url => {
    let id = '';
    url = url
      .replace(/(>|<)/gi, '')
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if (url[2] !== undefined) {
      id = url[2].split(/[^0-9a-z_\-]/i);
      id = id[0];
    } else {
      id = url;
    }
    return id;
  };

  // find relevant matches and add them accordlingly i worked this out terrible but it is ok
  // if this is cleaned up it will trickle down.
  // invoke this immediately does not need to be used anywhere else
  (() => {
    destructuredMsg.forEach(word => {
      if (word.match(REGEX.youTubePattern)) {
        matches.push({ youtube: word });
      }
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
      if (match.youtube) {
        return (
          <YouTube
            url={`https://www.youtube.com/embed/${getYouTubeID(match.youtube)}`}
          />
        );
      }
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
    <div
      className={`badge badge-${color} ${search ? 'msgAlt' : 'msgText'} mb-2`}>
      {matchesDone.length
        ? matchesDone.map((match, index) => (
            <div key={match.props.url.concat(index + 1)}>{match}</div>
          ))
        : null}
      {noLinks.length !== 0 &&
        (search
          ? noLinks.map((word, index) => {
              if (word.includes(search)) {
                return (
                  <React.Fragment key={word + index}>
                    <span className="highlight">{word}</span>{' '}
                  </React.Fragment>
                );
              }
              return (
                <React.Fragment key={word + index}>
                  <span>{word}</span>{' '}
                </React.Fragment>
              );
            })
          : noLinks.join(' '))}
    </div>
  );
};

export default MessageBody;
