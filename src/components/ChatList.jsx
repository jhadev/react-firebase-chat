import React, { useState } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import PropTypes from 'prop-types';
import './ChatList.scss';

const ChatList = ({ rooms, setChatRoom, currentRoom, dropdown }) => {
  const [dropdownOpen, setDropdown] = useState(false);

  return dropdown ? (
    <Dropdown
      direction="up"
      size="sm"
      group
      isOpen={dropdownOpen}
      toggle={() => setDropdown(!dropdownOpen)}
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
};

ChatList.propTypes = {
  rooms: PropTypes.array,
  setChatRoom: PropTypes.func,
  currentRoom: PropTypes.string,
  dropdown: PropTypes.bool
};

export default ChatList;
