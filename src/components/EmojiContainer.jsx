import React from 'react';
import { PopoverBody, UncontrolledPopover } from 'reactstrap';
import 'emoji-mart/css/emoji-mart.css';
import { NimblePicker } from 'emoji-mart';
import data from 'emoji-mart/data/apple.json';
import moment from 'moment';

const EmojiContainer = ({ setNewMessage, setTimestamp }) => {
  return (
    <UncontrolledPopover placement="top" target="Popover1" trigger="legacy">
      <PopoverBody style={{ maxWidth: '100%' }}>
        <NimblePicker
          container="inline"
          style={{ width: '100%' }}
          set="apple"
          data={data}
          search={false}
          showSkinTones={false}
          onSelect={emoji => {
            setTimestamp(moment().format('LLLL'));
            setNewMessage(prevMessage => prevMessage.concat(emoji.native));
          }}
          title={'emojis'}
          emoji={'grinning'}
        />
      </PopoverBody>
    </UncontrolledPopover>
  );
};

export default EmojiContainer;
