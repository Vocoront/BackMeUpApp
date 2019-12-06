import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import styles from "react-awesome-button/src/styles/themes/theme-bojack";

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
        <AwesomeButton
          style={styles}
          size="medium"
          type="link"
          onPress={() => this.props.submitLogIn(this.state)}
        >
          Log In
        </AwesomeButton>
      </div>
    );
  }
}

export default LogIn;
