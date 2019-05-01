import React, { useState } from "react";
import { withAuthorization } from "../components/Session/index";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";
import AuthUserContext from "../components/Session/context";

const Home = props => {
  const [showChat, handleChange] = useState(false);
  const [messageObject, handleMessage] = useState({
    username: "",
    timestamp: Date.now(),
    message: ""
  });

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div className="container">
          <h1 className="text-center my-4">Home {authUser.email}</h1>
          {/* WILL BE CHAT EVENTUALLY */}
          <button
            className="btn btn-primary"
            onClick={() => handleChange(!showChat)}
          >
            Show Chat
          </button>
          {showChat && (
            <div className="my-4">
              {/* RENDER CHAT COMPONENT */}
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
                      value={messageObject.message}
                      onChange={event =>
                        handleMessage({
                          username: authUser.email,
                          message: event.target.value,
                          timestamp: new Date()
                        })
                      }
                    />
                  </Col>
                </FormGroup>
                <button
                  className="btn btn-primary"
                  onClick={event => {
                    event.preventDefault();
                    props.firebase.chat(messageObject);
                    handleMessage({
                      username: authUser.email,
                      message: "",
                      timestamp: new Date()
                    });
                  }}
                >
                  Send
                </button>
              </Form>
            </div>
          )}
        </div>
      )}
    </AuthUserContext.Consumer>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
