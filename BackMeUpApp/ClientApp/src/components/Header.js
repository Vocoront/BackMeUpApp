import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { deleteToken } from "../actions/user";
const Header = props => (
  <Navbar bg="dark" variant="dark" sticky="top" expand="md" className="header">
    <div className="header__title">Back Me Up</div>

    <div className="searchDivHeader">
      <Form.Control type="search" placeholder="search by tags" />
    </div>
    {/* <div className="header__filler"></div> */}
    <NavLink
      className="header__navlink"
      exact={true}
      activeClassName="header__navlink--is-active"
      to="/"
    >
      Home
    </NavLink>

    {props.user.token ? (
      <div>
        <NavLink
          className="header__navlink"
          activeClassName="header__navlink--is-active"
          to="/profile"
        >
          Profile
        </NavLink>
        <NavLink
          className="header__navlink"
          activeClassName="header__navlink--is-active"
          to="/createpost"
        >
          Create Post
        </NavLink>
        <NavLink
          className="header__navlink"
          to="/"
          onClick={() => props.dispatch(deleteToken())}
        >
          Logout
        </NavLink>
      </div>
    ) : (
      <NavLink
        className="header__navlink"
        activeClassName="header__navlink--is-active"
        to="/login"
      >
        Log In
      </NavLink>
    )}
  </Navbar>
);

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(Header);
