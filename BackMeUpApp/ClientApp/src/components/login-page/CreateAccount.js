import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import styles from "react-awesome-button/src/styles/themes/theme-bojack";

class CreateAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
      repassword: ""
    };
  }
  render() {
    return (
      <div>
        <div className="login">
          Username{" "}
          <input
            type="text"
            onChange={e => {
              this.setState({ username: e.target.value });
            }}
            placeholder="Enter username"
          />
          Email{" "}
          <input
            type="email"
            onChange={e => {
              this.setState({ email: e.target.value });
            }}
            placeholder="Enter email"
          />
          Password{" "}
          <input
            type="password"
            onChange={e => {
              this.setState({ password: e.target.value });
            }}
            placeholder="Enter password"
          />
          Confirm Password{" "}
          <input
            type="password"
            onChange={e => {
              this.setState({ repassword: e.target.value });
            }}
            placeholder="Confirm password"
          />
          <AwesomeButton
            style={styles}
            size="medium"
            type="link"
            onPress={() => this.props.createAccount(this.state)}
          >
            Create Account
          </AwesomeButton>
        </div>
      </div>
    );
  }
}

export default CreateAccount;
