import React, { useState } from "react";
import { withAuthorization } from "../components/Session/index";
import { Card } from "reactstrap";

const Home = () => {
  const [showChat, handleChange] = useState(false);

  return (
    <div className="container">
      <h1 className="text-center my-4">Home</h1>
      {/* WILL BE CHAT EVENTUALLY */}
      <button
        className="btn btn-primary"
        onClick={() => handleChange(!showChat)}
      >
        Show Chat
      </button>
      {showChat && (
        <div className="my-4">
          <Card>Hi!</Card>
        </div>
      )}
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
