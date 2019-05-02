import React, { useState, useEffect } from "react";
import AuthUserContext from "../components/Session/context";
import { withAuthorization } from "../components/Session/index";
import Message from "./Message";
import MessageForm from "./MessageForm";
import moment from "moment";

const Home = props => {
  const [showChat, handleChange] = useState(false);
  const [username, setUsername] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(null);

  const chatroom = props.firebase.chat();

  useEffect(() => {
    const handleNewMessages = snapshot => {
      if (snapshot.val()) setChat(snapshot.val());
    };
    chatroom.on("value", handleNewMessages);
    return () => {
      chatroom.off("value", handleNewMessages);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    if (message !== "") {
      let messageObj = {
        user: username,
        timestamp: timestamp,
        message: message
      };
      props.firebase.send(messageObj);
    }
    setMessage("");
    setTimestamp("");
  };

  const packageMsg = event => {
    event.preventDefault();
    sendMessage();
  };

  const setMsg = event => {
    setTimestamp(moment().format("LLLL"));
    setMessage(event.target.value);
  };

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div className="container">
          <h1 className="text-center my-4">Welcome, {authUser.email}</h1>
          {/* WILL BE CHAT EVENTUALLY */}
          <button
            className="btn btn-primary"
            onClick={() => {
              handleChange(!showChat);
              setUsername(authUser.email);
            }}
          >
            {!showChat ? "Show Chat" : "Hide Chat"}
          </button>
          {showChat && (
            <div className="my-4">
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
                          <Message
                            user={chat[message]["user"]}
                            timestamp={chat[message]["timestamp"]}
                            message={chat[message]["message"]}
                            badge={"badge badge-primary msgText mb-2"}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className="d-flex flex-column align-items-start"
                          key={index}
                        >
                          <Message
                            user={chat[message]["user"]}
                            timestamp={chat[message]["timestamp"]}
                            message={chat[message]["message"]}
                            badge={"badge badge-secondary msgText mb-2"}
                          />
                        </div>
                      );
                    }
                  })}
              </>
              <MessageForm
                message={message}
                setMsg={setMsg}
                packageMsg={packageMsg}
              />
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
