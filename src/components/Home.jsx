import React from "react";
import { withAuthorization } from "../components/Session/index";

const Home = () => {
  return (
    <div className="container">
      <h1 className="text-center my-4">Home</h1>
      {/* WILL BE CHAT EVENTUALLY */}
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
