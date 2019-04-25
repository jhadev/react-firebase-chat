import React from "react";

import { PasswordForgetForm } from "./PasswordForget";
import PasswordChangeForm from "./PasswordChange";

const Account = () => (
  <div>
    <h1 className="my-4 text-center">Account Page</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

export default Account;
