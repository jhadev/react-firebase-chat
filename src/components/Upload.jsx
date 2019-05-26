import React from 'react';

const Upload = props => {
  const widget = () => {
    window.cloudinary.openUploadWidget(
      {
        cloud_name: process.env.REACT_APP_CLOUDINARY_NAME,
        upload_preset: process.env.REACT_APP_CLOUDINARY_PRESET,
        tags: ['react-firebase-chat'],
        sources: ['local', 'url'],
        defaultSource: 'local'
      },
      function(error, result) {
        console.log('This is the result of the last upload', result);
      }
    );
  };
  return (
    <span
      className="input-group-text"
      id="inputGroup-sizing-default"
      onClick={widget}
    >
      <div id="upload" className="cloudinary btn btn-sm">
        <i className="fas fa-camera" />
      </div>
    </span>
  );
};

export default Upload;
