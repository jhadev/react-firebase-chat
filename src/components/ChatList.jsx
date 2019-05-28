import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const ChatList = ({ rooms, setChatRoom }) => (
  <ListGroup className="mb-3">
    {rooms.map(room => (
      <ListGroupItem
        tag="button"
        action
        key={room}
        value={room}
        name={room}
        onClick={setChatRoom}
      >
        {room}
      </ListGroupItem>
    ))}
  </ListGroup>
);

export default ChatList;
