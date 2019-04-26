import React from "react";
import { withFirebase } from "./Firebase/index";

const SignOut = ({ firebase }) => {
  return (
    <div className="nav-link signOut" onClick={firebase.doSignOutUser}>
      Sign Out
    </div>
  );
};

export default withFirebase(SignOut);
