import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import { connect } from "react-redux";
import { clearFilter } from "../actions/filter";
import { signOut } from "../services/userAuth";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagFilter: ""
    };
  }

  render() {
    return (
      <Navbar
        bg="dark"
        variant="dark"
        sticky="top"
        expand="md"
        className="header"
      >
        <div className="header__title">Back Me Up</div>

        <div className="header__filler"></div>
        <NavLink
          className="header__navlink"
          exact={true}
          activeClassName="header__navlink--is-active"
          onClick={() => this.props.dispatch(clearFilter())}
          to="/"
        >
          Home
        </NavLink>

        {this.props.user.token ? (
          <div>
            <NavLink
              className="header__navlink"
              activeClassName="header__navlink--is-active"
              onClick={() => this.props.dispatch(clearFilter())}
              to="/profile"
            >
              Profile
            </NavLink>
            <NavLink
              className="header__navlink"
              activeClassName="header__navlink--is-active"
              onClick={() => this.props.dispatch(clearFilter())}
              to="/createpost"
            >
              Create Post
            </NavLink>
            <NavLink
              className="header__navlink"
              to="/"
              onClick={() => signOut()}
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
  }
}

const mapStateToProps = state => ({
  user: state.user
});
export default connect(mapStateToProps)(Header);
