import React, { Component } from "react";
import { connect } from "react-redux";
import LogIn from "./LogIn";
import CreateAccount from "./CreateAccount";

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true
    };
    this.loginMode.bind(this);
    this.loginSubmit.bind(this);
    this.createAccount.bind(this);
  }

  createAccount = () => {
    const formData = new FormData();
    formData.append("username", "miloscar");
    formData.append("email", "misacar123");
    formData.append("password", "1234");
    fetch("api/user", { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(er => console.log(er));
  };

  loginMode = mode => {
    this.setState({ login: mode });
  };

  loginSubmit = () => {
    fetch("api/user/me")
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(er => console.log(er));
  };

  render() {
    return (
      <div className="container">
        {this.props.user.username}
        <div className="login--option-container">
          <div
            onClick={() => this.loginMode(true)}
            className={
              (this.state.login && "login--option login--option__selected") ||
              "login--option "
            }
          >
            Log In
          </div>
          <div
            onClick={() => this.loginMode(false)}
            className={
              (this.state.login && "login--option") ||
              "login--option  login--option__selected"
            }
          >
            Create Account
          </div>
        </div>
        {(this.state.login && <LogIn submitLogIn={this.createAccount} />) || (
          <CreateAccount />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(LogInPage);
