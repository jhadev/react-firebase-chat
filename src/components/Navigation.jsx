import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from "reactstrap";

import SignOut from "./SignOut";
import * as ROUTES from "../constants/routes";

class Navigation extends Component {
  state = {
    isOpen: false
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { authUser } = this.props;

    return (
      <div className="sticky-top">
        <Navbar
          className="shadow"
          color="light"
          light
          fixed="fixed"
          expand="md"
        >
          <NavbarBrand href="/">React Firebase Auth</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {authUser ? (
                <React.Fragment>
                  <NavItem>
                    <NavLink className="font nav-link" to={ROUTES.LANDING}>
                      Landing
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navStyle nav-link" to={ROUTES.HOME}>
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navStyle nav-link" to={ROUTES.ACCOUNT}>
                      Account
                    </NavLink>
                  </NavItem>
                  <NavItem className="nav-link">
                    <SignOut />
                  </NavItem>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavItem>
                    <NavLink className="navStyle nav-link" to={ROUTES.SIGN_UP}>
                      Sign Up
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink className="navStyle nav-link" to={ROUTES.SIGN_IN}>
                      Sign In
                    </NavLink>
                  </NavItem>
                </React.Fragment>
              )}
              {/* <NavItem>
                <NavLink className="navStyle nav-link" to={ROUTES.HOME}>
                  Home
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navStyle nav-link" to={ROUTES.SIGN_UP}>
                  Sign Up
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navStyle nav-link" to={ROUTES.SIGN_IN}>
                  Sign In
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="navStyle nav-link" to={ROUTES.ACCOUNT}>
                  Account
                </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink className="navStyle nav-link" to={ROUTES.ADMIN}>
                  Admin
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
