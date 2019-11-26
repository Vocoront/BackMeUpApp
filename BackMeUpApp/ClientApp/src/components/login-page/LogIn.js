import React, { Component } from "react";

class LogIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }
  render() {
    return (
      <div className="login">
        Username{" "}
        <input
          type="text"
          onChange={e => {
            this.setState({ username: e.target.value });
          }}
          placeholder="Enter username"
        />
        Password{" "}
        <input
          type="password"
          onChange={e => {
            this.setState({ password: e.target.value });
          }}
          placeholder="Enter password"
        />
        <div
          className="login--btn"
          onClick={() =>
            this.props.submitLogIn(this.state)
          }
        >
          Log In
        </div>
      </div>
    );
  }
}

export default LogIn;
