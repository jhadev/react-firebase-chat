import React from 'react';
import {
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import PropTypes from 'prop-types';

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
      <DropdownToggle color="link">
        <i className="fas fa-comments text-dark" />
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
          className="text-center"
        >
          {room}
        </ListGroupItem>
      ))}
    </ListGroup>
  );

ChatList.propTypes = {
  rooms: PropTypes.array,
  setChatRoom: PropTypes.func,
  currentRoom: PropTypes.string,
  dropdown: PropTypes.bool,
  isOpen: PropTypes.bool,
  handleDropdown: PropTypes.func
};

export default ChatList;
