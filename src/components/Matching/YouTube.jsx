import React from 'react';
import Iframe from 'react-iframe';

const YouTube = ({ url }) => {
  return (
    <Iframe
      url={url}
      width="100%"
      height="100%"
      className="youtube-video mt-1 rounded"
      display="initial"
      position="relative"
      allowFullScreen
    />
  );
};

export default YouTube;
