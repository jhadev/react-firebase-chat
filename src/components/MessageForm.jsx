import React from "react";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";

const MessageForm = ({ message, setMsg, packageMsg }) => {
  return (
    <React.Fragment>
      <div>
        <Form>
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
              />
            </Col>
          </FormGroup>
        </Form>
      </div>
      <div>
        <button className="btn btn-primary" onClick={packageMsg}>
          Send
        </button>
      </div>
    </React.Fragment>
  );
};

export default MessageForm;
