import React from "react";
import { AuthUserContext } from "./Session/index";
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

const Navigation = ({ isOpen, toggle }) => {
  return (
    <div>
      {/* consume context provied in session index based on if user is authed */}
      <AuthUserContext.Consumer>
        {authUser => (
          <div className="sticky-top">
            <Navbar
              className="shadow"
              color="light"
              light
              fixed="fixed"
              expand="md"
            >
              <NavbarBrand href="/">React Firebase Auth</NavbarBrand>
              <NavbarToggler onClick={toggle} />
              <Collapse isOpen={isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  {/* conditionally render navbar items based on if a user is signed in or not */}
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
                        <NavLink
                          className="navStyle nav-link"
                          to={ROUTES.ACCOUNT}
                        >
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
                        <NavLink
                          className="navStyle nav-link"
                          to={ROUTES.SIGN_UP}
                        >
                          Sign Up
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className="navStyle nav-link"
                          to={ROUTES.SIGN_IN}
                        >
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
        )}
      </AuthUserContext.Consumer>
    </div>
  );
};

export default Navigation;
