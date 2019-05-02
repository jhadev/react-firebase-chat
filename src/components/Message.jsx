import React from "react";

const Message = ({ user, timestamp, message, badge }) => {
  return (
    <>
      <div className="my-1">{user}</div>
      <div className="my-1">{timestamp}</div>
      <div className={badge}>{message}</div>
    </>
  );
};

export default Message;
