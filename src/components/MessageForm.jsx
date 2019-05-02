import React from "react";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";

const MessageForm = ({ message, setMsg, packageMsg, sendMessage }) => {
  return (
    <React.Fragment>
      <div className="sticky-footer">
        <Form onSubmit={packageMsg}>
          <FormGroup row>
            <Label for="exampleText" sm={2}>
              Chat!
            </Label>
            <Col sm={10}>
              <Input
                type="textarea"
                name="text"
                id="exampleText"
                value={message}
                onChange={setMsg}
                onKeyUp={event =>
                  event.key === "Enter" ? sendMessage() : false
                }
              />
            </Col>
          </FormGroup>
          <button className="btn btn-primary mb-2">Send</button>
        </Form>
      </div>
    </React.Fragment>
  );
};

export default MessageForm;
