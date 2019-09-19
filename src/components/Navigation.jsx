/* eslint-disable react/style-prop-object */
import React, { useContext, useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
import Switch from 'react-switch';
import { AuthUserContext } from './Session';
import { withFirebase } from './Firebase';
import SignOut from './SignOut';
import * as ROLES from '../constants/roles';
import * as ROUTES from '../constants/routes';
import './styles/components/navigation.scss';

const Navigation = ({ firebase }) => {
  const authUser = useContext(AuthUserContext);
  const [isOpen, toggle] = useState(false);
  const [isOnline, setOnlineStatus] = useState(null);

  useEffect(() => {
    if (authUser) {
      setOnlineStatus(authUser.online);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      firebase.setOnlineStatus(authUser, isOnline);
    }
  }, [authUser, firebase, isOnline]);

  const toggleOnlineStatus = status => {
    setOnlineStatus(status);
  };

  return (
    <div>
      {/* consume context provided in session index based on if user is authed */}
      <>
        <Navbar
          className="navShadow fixed-top navStyle"
          dark
          fixed="fixed"
          expand="md">
          <NavbarBrand href={ROUTES.LANDING}>
            {'Just Another Chat'}
            <i className="far fa-comments ml-2" />
          </NavbarBrand>
          <NavbarToggler onClick={() => toggle(prevValue => !prevValue)} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {/* conditionally render navbar items based on if a user is signed in or not */}
              {authUser ? (
                <React.Fragment>
                  <NavItem active>
                    <label
                      className="my-1 mx-2 align-middle switchLabel"
                      htmlFor="material-switch">
                      <span className="my-1">
                        {isOnline ? 'active' : 'away'}
                      </span>
                      <Switch
                        checked={isOnline || false}
                        onChange={toggleOnlineStatus}
                        onColor="#56ff40"
                        onHandleColor="#ebedeb"
                        handleDiameter={16}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={10}
                        width={30}
                        className="react-switch align-middle my-2 mx-1"
                        id="material-switch"
                      />
                    </label>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => toggle(prevValue => !prevValue)}
                      className="navStyle nav-link"
                      to={ROUTES.HOME}>
                      Home
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => toggle(prevValue => !prevValue)}
                      className="navStyle nav-link"
                      to={ROUTES.DMS}>
                      DMs
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => toggle(prevValue => !prevValue)}
                      className="navStyle nav-link"
                      to={ROUTES.ACCOUNT}>
                      Account
                    </NavLink>
                  </NavItem>
                  {/* RESTRICT ADMIN */}
                  {ROLES.ADMIN.includes(authUser.email) && (
                    <NavItem>
                      <NavLink
                        onClick={() => toggle(prevValue => !prevValue)}
                        className="navStyle nav-link"
                        to={ROUTES.ADMIN}>
                        Admin
                      </NavLink>
                    </NavItem>
                  )}
                  <NavItem>
                    <SignOut />
                  </NavItem>
                  <NavItem>
                    <a
                      href="https://github.com/jhadev/react-firebase-chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link navStyle">
                      GitHub
                    </a>
                  </NavItem>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <NavItem>
                    <NavLink
                      onClick={() => toggle(prevValue => !prevValue)}
                      className="navStyle nav-link"
                      to={ROUTES.SIGN_UP}>
                      Sign Up
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      onClick={() => toggle(prevValue => !prevValue)}
                      className="navStyle nav-link"
                      to={ROUTES.SIGN_IN}>
                      Sign In
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <a
                      href="https://github.com/jhadev/react-firebase-chat"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="nav-link navStyle">
                      GitHub
                    </a>
                  </NavItem>
                </React.Fragment>
              )}
            </Nav>
          </Collapse>
        </Navbar>
      </>
    </div>
  );
};

export default withFirebase(Navigation);
