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
  console.log(rooms);

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
            active={currentRoom === (room.email || room) ? true : false}
            key={dms ? room.email : room}
            value={dms ? room.email : room}
            name={dms ? room.email : room}
            onClick={setChatRoom}>
            {dms ? (
              <>
                {room.online ? (
                  <>
                    <i className="fas fa-circle"></i>
                    {'  '}
                    {room.email}
                  </>
                ) : (
                  <>
                    {' '}
                    <i className="far fa-circle"></i>
                    {'  '}
                    {room.email}
                  </>
                )}
              </>
            ) : (
              <>{room}</>
            )}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  ) : (
    <ListGroup className="mb-3 chatList">
      {rooms.map(room => (
        <ListGroupItem
          tag="button"
          active={currentRoom === (dms ? room.email : room) ? true : false}
          action
          key={dms ? room.email : room}
          value={dms ? room.email : room}
          name={dms ? room.email : room}
          onClick={e => setChatRoom(e)}
          className="text-center">
          {dms ? (
            <>
              {room.online ? (
                <>
                  <i className="fas fa-circle"></i>
                  {'  '}
                  {room.email}
                </>
              ) : (
                <>
                  {' '}
                  <i className="far fa-circle"></i>
                  {'  '}
                  {room.email}
                </>
              )}
            </>
          ) : (
            <>{room}</>
          )}
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
