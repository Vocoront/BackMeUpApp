import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import LogIn from "./LogIn";
import CreateAccount from "./CreateAccount";

import { createAcount, loginSubmit } from "../../services/userAuth";
class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      loading: false
    };
    this.loginMode = this.loginMode.bind(this);
    this.loginSubmit = this.loginSubmit.bind(this);
    this.createAccount = this.createAccount.bind(this);
  }

  createAccount = async ({ username, email, password, repassword }) => {
    this.setState((state, props) => ({ loading: true }));
    let result = await createAcount(
      username,
      email,
      password,
      repassword,
      this.props.history
    );
    this.setState((state, props) => ({ loading: false }));
    if (result) this.props.history.push("/");
  };

  loginMode = mode => {
    this.setState({ login: mode });
  };

  loginSubmit = async ({ username, password }) => {
    this.setState((state, props) => ({ loading: true }));
    let result = await loginSubmit(username, password, this.props.history);
    this.setState((state, props) => ({ loading: false }));
    if (result) this.props.history.push("/");
  };

  render() {
    return (
      <div>
        {this.state.loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <div>
            <div className="post">
              <div className="login--option-container">
                <div
                  onClick={() => this.loginMode(true)}
                  className={
                    (this.state.login &&
                      "login--option login__option--left login--option__selected") ||
                    "login--option login__option--left"
                  }
                >
                  Log In
                </div>
                <div
                  onClick={() => this.loginMode(false)}
                  className={
                    (this.state.login &&
                      "login--option login__option--right") ||
                    "login--option  login--option__selected login__option--right"
                  }
                >
                  Create Account
                </div>
              </div>

              <div>
                {this.state.login ? (
                  <LogIn submitLogIn={this.loginSubmit} />
                ) : (
                  <CreateAccount createAccount={this.createAccount} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(LogInPage);
