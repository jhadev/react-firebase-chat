import React, { useState } from 'react';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import 'emoji-mart/css/emoji-mart.css';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/apple.json';

const EmojiContainer = ({ emojiPicker, handlePickerOpen, setNewMessage }) => {
  return (
    <Dropdown
      direction="up"
      size="sm"
      isOpen={emojiPicker}
      toggle={handlePickerOpen}
    >
      <DropdownToggle className="text-dark" color="link">
        <i className="far fa-grin-tongue-squint" />
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem toggle={false}>
          <NimblePicker
            set="apple"
            data={data}
            onSelect={emoji =>
              setNewMessage(prevMessage => prevMessage.concat(emoji.native))
            }
            title={'emojis'}
          />
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default EmojiContainer;
