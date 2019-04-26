import React from "react";
import { withAuthorization } from "../components/Session/index";

const Home = () => {
  // const user = localStorage.getItem("email");
  return (
    <div className="container">
      <h1 className="text-center my-4">Home</h1>
      {/* {user ? <h2 className="userName text-center">Welcome, {user}</h2> : null} */}
    </div>
  );
};

//condition for authuser check to restrict routes. If user isn't authorized, home is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Home);
