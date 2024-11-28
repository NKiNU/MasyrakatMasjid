// Message.js
import React from 'react';

const Message = ({ sender, subject, body }) => {
  return (
    <div>
      <h3>{sender}</h3>
      <p><strong>{subject}</strong></p>
      <p>{body}</p>
    </div>
  );
};

export default Message;
