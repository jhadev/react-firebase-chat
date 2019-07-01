import React from 'react';

const Audio = ({ url }) => {
  return (
    <div>
      <audio controls>
        <source src={url} type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default Audio;
