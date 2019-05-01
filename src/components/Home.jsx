import React, { useState, useEffect } from "react";
import AuthUserContext from "../components/Session/context";
import { withAuthorization } from "../components/Session/index";
import { Col, Form, FormGroup, Label, Input } from "reactstrap";
import moment from "moment";

const Home = props => {
  const [showChat, handleChange] = useState(false);
  const [username, setUsername] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);

  const chatroom = props.firebase.chat();

  useEffect(() => {
    const handleNewMessages = snap => {
      if (snap.val()) setChat(snap.val());
    };
    chatroom.on("value", handleNewMessages);
    return () => {
      chatroom.off("value", handleNewMessages);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log(chat);
  // console.log();
  // console.log(username, timestamp, message);

  const sendMessage = () => {
    let messageObj = { user: username, timestamp: timestamp, message: message };
    props.firebase.send(messageObj);
    setMessage("");
    setTimestamp("");
  };

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div className="container">
          <h1 className="text-center my-4">Home {authUser.email}</h1>
          {/* WILL BE CHAT EVENTUALLY */}
          <button
            className="btn btn-primary"
            onClick={() => {
              handleChange(!showChat);
              setUsername(authUser.email);
            }}
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
                      value={message}
                      onChange={event => {
                        setMessage(event.target.value);
                        setTimestamp(moment().format("LLLL"));
                      }}
                    />
                  </Col>
                </FormGroup>
                <button
                  className="btn btn-primary"
                  onClick={event => {
                    event.preventDefault();
                    sendMessage();
                  }}
                >
                  Send
                </button>
              </Form>
              <>
                {/* EXTRACT THIS */}
                {chat !== null &&
                  Object.keys(chat).map((message, index) => {
                    if (authUser.email === chat[message]["user"]) {
                      return (
                        <div
                          className="d-flex flex-column align-items-end"
                          key={index}
                        >
                          <div className="my-1">{chat[message]["user"]}</div>
                          <div className="my-1">
                            {chat[message]["timestamp"]}
                          </div>
                          <div className="my-1">{chat[message]["message"]}</div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="d-flex flex-column align-items-start"
                          key={index}
                        >
                          <div className="my-1">{chat[message]["user"]}</div>
                          <div className="my-1">
                            {chat[message]["timestamp"]}
                          </div>
                          <div className="my-1">{chat[message]["message"]}</div>
                        </div>
                      );
                    }
                  })}
              </>
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
