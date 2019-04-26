import React from "react";

import { PasswordForgetForm } from "./PasswordForget";
import PasswordChangeForm from "./PasswordChange";
import { withAuthorization } from "../components/Session/index";
import AuthUserContext from "../components/Session/context";

const Account = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1 className="my-4 text-center">Account: {authUser.email} </h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

//condition for authuser check to restrict routes. If user isn't authorized, account page is off limits
const condition = authUser => !!authUser;

export default withAuthorization(condition)(Account);
