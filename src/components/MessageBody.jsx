import React from 'react';
import * as REGEX from '../constants/regex';
import PropTypes from 'prop-types';
import './styles/components/message-body.scss';

const MessageBody = ({ body, color }) => {
  // let msgBody = (
  //   <div className={`badge badge-${color} msgText mb-2`}>{body}</div>
  // );

  //extremely hacky
  let msgCopy = `${body}`;

  let matches = [];

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
    console.log(matches);
  });

  const doMatches = () => {
    let innerHTML = [];
    matches.map(match => {
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

  const mappedMatches = matches.map(match => ({
    url: match.url,
    img: match.img,
    audio: match.audio,
    video: match.video
  }));

  console.log(mappedMatches);

  const messageWithoutLink = () => {
    return destructuredMsg
      .filter(word => word !== word.match(REGEX.urlPattern))
      .join(' ');
    // let url = '';
    // let img = '';
    // let audio = '';
    // let video = '';
    // if (mappedMatches[0].url) {
    //   url = mappedMatches[0].url;
    // }
    // console.log(url);
    // // return destructuredMsg.filter(word => word !== )
    // const filteredMsg = destructuredMsg.filter(
    //   word => word !== matches.map(match => match.url)
    // );
    // if (mappedMatches.length !== 0) {
    //   mappedMatches.forEach(({ url, img, audio, video }) => {
    //     let textOnly;
    //     if (
    //       url !== undefined ||
    //       img !== undefined ||
    //       audio !== undefined ||
    //       video !== undefined
    //     ) {
    //       textOnly = destructuredMsg.filter(
    //         word =>
    //           word !== url || word !== img || word !== audio || word !== video
    //       );
    //     }
    //     return textOnly;
    //   });
    // }
  };
  // will overwrite message if links are detected
  console.log(messageWithoutLink());
  return (
    <div className={`badge badge-${color} msgText mb-2`}>
      {doMatches().length > 0
        ? doMatches().map(match => <div>{match}</div>)
        : body}{' '}
      {/* {messageWithoutLink().join(' ')} */}
    </div>
  );
};

MessageBody.propTypes = {
  body: PropTypes.string,
  color: PropTypes.string
};

export default MessageBody;
