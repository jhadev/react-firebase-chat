import React from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import 'emoji-mart/css/emoji-mart.css';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/apple.json';

const EmojiContainer = ({ emojiPicker, handlePickerOpen, setNewMessage }) => {
  return (
    <Popover
      placement="top"
      isOpen={emojiPicker}
      target="Popover1"
      toggle={handlePickerOpen}
    >
      <PopoverBody style={{ maxWidth: '100%' }}>
        <NimblePicker
          style={{ width: '100%' }}
          set="apple"
          data={data}
          onSelect={emoji =>
            setNewMessage(prevMessage => prevMessage.concat(emoji.native))
          }
          title={'emojis'}
        />
      </PopoverBody>
    </Popover>
  );
};

export default EmojiContainer;
