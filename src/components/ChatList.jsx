import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

const ChatList = ({
  rooms,
  setChatRoom,
  currentRoom,
  dropdown,
  isOpen,
  handleDropdown
}) =>
  dropdown ? (
    <Dropdown
      direction="up"
      size="sm"
      group
      isOpen={isOpen}
      toggle={handleDropdown}
    >
      <DropdownToggle className="text-dark" color="link">
        <i className="fas fa-comments" />
      </DropdownToggle>
      <DropdownMenu>
        {rooms.map(room => (
          <DropdownItem
            tag="button"
            active={currentRoom === room ? true : false}
            key={room}
            value={room}
            name={room}
            onClick={setChatRoom}
          >
            {room}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  ) : (
    <ListGroup className="mb-3">
      {rooms.map(room => (
        <ListGroupItem
          tag="button"
          active={currentRoom === room ? true : false}
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
