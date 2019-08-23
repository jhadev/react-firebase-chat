import React from 'react';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';

const RoomInput = ({ value, onSubmit, onChange, color, add }) => {
  return (
    <>
      <h3 className="text-center my-3">{add ? 'Add Room' : 'Remove Room'}</h3>
      <InputGroup>
        <Input
          placeholder={add ? 'add a room' : 'remove a room'}
          name={add ? 'roomToAdd' : 'roomToRemove'}
          value={value}
          onChange={onChange}
        />
        <InputGroupAddon addonType="append">
          <Button color={color} onClick={onSubmit}>
            {add ? 'Add' : 'Remove'}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

export default RoomInput;
