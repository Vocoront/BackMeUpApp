import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { deleteToken } from "../actions/token";
const Header = props => (
  <div className="header">
    <div className="header__title">Back Me Up</div>
    <div className="header__filler"></div>
    <NavLink
      className="header__navlink"
      exact={true}
      activeClassName="header__navlink--is-active"
      to="/"
    >
      Home
    </NavLink>

    {props.token.token ? (
      <div>
        <NavLink
          className="header__navlink"
          activeClassName="header__navlink--is-active"
          to={"/user/"+props.user.username}
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
  </div>
);

const mapStateToProps = state => ({ token: state.token, user: state.user });
export default connect(mapStateToProps)(Header);
