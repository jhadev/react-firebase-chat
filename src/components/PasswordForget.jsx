import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../components/Firebase/index";
import * as ROUTES from "../constants/routes";

const PasswordForget = () => (
  <div>
    <div className="my-4">
      <PasswordForgetForm />
    </div>
  </div>
);

class PasswordForgetFormBase extends Component {
  state = {
    email: "",
    error: null
  };

  onSubmit = event => {
    event.preventDefault();
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
      .then(() => {
        this.setState({ email: "", error: null });
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  onChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, error } = this.state;

    const isInvalid = email === "";

    return (
      <div className="row justify-content-center">
        <div className="col-md-6 col-12">
          <h4 className="text-center mb-4">Forgot your password?</h4>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                name="email"
                value={this.state.email}
                onChange={this.onChange}
                type="text"
                placeholder="Email Address"
                className="form-control"
              />
            </div>
            <button
              disabled={isInvalid}
              className="btn btn-primary mb-2"
              type="submit"
            >
              Reset My Password
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForget;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
