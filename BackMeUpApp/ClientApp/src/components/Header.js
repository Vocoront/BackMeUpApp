import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import { connect } from "react-redux";
import { deleteToken } from "../actions/user";
import { setFilter } from "../actions/tag";
import { setTag } from "../actions/tag";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

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

        <div className="sort">
          <Dropdown size="lg">
            <Dropdown.Toggle variant="dark" id="dropdown-basic">
              Sort
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => this.props.dispatch(setFilter("MostPopular"))}
              >
                Most popular
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.props.dispatch(setFilter("Newest"))}
              >
                Newest
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => this.props.dispatch(setFilter("Controversial"))}
              >
                Controversial
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="searchDivHeader">
          <Form.Control
            variant="dark"
            type="search"
            placeholder="search by tag"
            onChange={e => {
              this.setState({ tagFilter: e.target.value });
            }}
          />
          <Button
            variant="outline-secondary"
            onClick={() => {
              this.props.dispatch(setTag(this.state.tagFilter));
            }}
          >
            <i class="fas fa-search"></i>
          </Button>
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

        {this.props.user.token ? (
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
              onClick={() => this.props.dispatch(deleteToken())}
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
  user: state.user,
  filter: state.tag.filter,
  tag: state.tag.tag
});
export default connect(mapStateToProps)(Header);
