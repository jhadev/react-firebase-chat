import React from "react";
import { withFirebase } from "./Firebase/index";

const SignOut = ({ firebase }) => {
  return (
    <button
      type="button"
      className="btn badge badge-danger"
      onClick={firebase.doSignOutUser}
    >
      Sign Out
    </button>
  );
};

export default withFirebase(SignOut);
