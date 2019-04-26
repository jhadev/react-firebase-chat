import React, { Component } from "react";
import { withFirebase } from "../components/Firebase/index";

class PasswordChangeForm extends Component {
  state = {
    passwordOne: "",
    passwordTwo: "",
    error: null
  };

  onSubmit = event => {
    event.preventDefault();
    const { passwordOne } = this.state;

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ passwordOne: "", passwordTwo: "", error: null });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";

    return (
      <div className="row justify-content-center">
        <div className="col-md-6 col-12">
          <h4 className="text-center my-4">Change your password.</h4>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
              <input
                name="passwordOne"
                value={passwordOne}
                onChange={this.onChange}
                type="password"
                placeholder="New Password"
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                name="passwordTwo"
                value={passwordTwo}
                onChange={this.onChange}
                type="password"
                placeholder="Confirm Password"
                className="form-control"
              />
            </div>
            <button
              disabled={isInvalid}
              className="btn btn-primary"
              type="submit"
            >
              Change My Password
            </button>

            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}

export default withFirebase(PasswordChangeForm);
