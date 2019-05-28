import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

const ChatList = ({ rooms, setChatRoom }) => (
  <ListGroup>
    {rooms.map(room => (
      <ListGroupItem
        key={room}
        value={room}
        name={room}
        onClick={e => setChatRoom(e.target)}
      >
        {room}
      </ListGroupItem>
    ))}
  </ListGroup>
);

export default ChatList;
