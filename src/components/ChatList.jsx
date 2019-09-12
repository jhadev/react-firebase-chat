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
import './styles/components/chat-list.scss';

const ChatList = ({ rooms, setChatRoom, currentRoom, dropdown, dms }) => {
  const [dropdownOpen, setDropdown] = useState(false);

  return dropdown ? (
    <Dropdown
      direction="up"
      size="sm"
      group
      isOpen={dropdownOpen}
      toggle={() => setDropdown(!dropdownOpen)}>
      <DropdownToggle color="link">
        <i className="fas fa-comments text-dark">
          <span className="tooltip-text mb-1">Switch Chat</span>
        </i>
      </DropdownToggle>
      <DropdownMenu>
        {rooms.map(room => (
          <DropdownItem
            tag="button"
            active={currentRoom === room ? true : false}
            key={room}
            value={room}
            name={room}
            onClick={setChatRoom}>
            {room}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  ) : (
    <ListGroup className="mb-3 chatList">
      {rooms.map(room => (
        <ListGroupItem
          tag="button"
          active={currentRoom === room ? true : false}
          action
          key={room}
          value={room}
          name={room}
          onClick={dms ? e => setChatRoom(e) : setChatRoom}
          className="text-center">
          {dms && (
            <span>
              {room.online ? (
                <i className="fas fa-circle"></i>
              ) : (
                <i className="far fa-circle"></i>
              )}
            </span>
          )}
          <span>
            {'  '}
            {room}
          </span>
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
