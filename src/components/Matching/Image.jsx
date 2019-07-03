import React from 'react';

const Image = ({ url }) => (
  <img
    className="msg-img img-fluid rounded img-thumbnail"
    src={url}
    alt="message-img"
  />
);

export default Image;
