import React, { Component } from "react";
import { connect } from "react-redux";
import passwordValidator from "password-validator";
import isEmail from "validator/lib/isEmail";

import LogIn from "./LogIn";
import CreateAccount from "./CreateAccount";
import ErrorContainer from "../error-page/ErrorContainer";
import {setToken} from '../../actions/token';

class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
      error: {
        visible: false,
        title: "title",
        message: "message"
      }
    };
    this.loginMode.bind(this);
    this.loginSubmit.bind(this);
    this.createAccount.bind(this);
    this.validatePassword.bind(this);
    this.validateEmail.bind(this);
    this.validateUsername.bind(this);
    this.clearError.bind(this);
    this.validate.bind(this);
  }

  validate = (username, email, password, repassword) => {
    if (!this.validateUsername(username)) {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Account coudn't be created!",
          message:
            "Username should have between 6 and 32 characters without spaces"
        }
      }));
      return false;
    }

    if (!this.validateEmail(email)) {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Account coudn't be created!",
          message: "Email is not valid"
        }
      }));
      return false;
    }

    if (!this.validatePassword(password, repassword)) {
      this.setState((state, props) => ({
        error: {
          visible: true,
          title: "Account coudn't be created!",
          message:
            "password should have between 6 and 32 characters without spaces, with at least one digit,one uppercase and one lowercase character"
        }
      }));
      return false;
    }
    return true;
  };

  clearError = () => {
    this.setState((state, props) => ({
      error: {
        visible: false,
        title: "title",
        message: "message"
      }
    }));
  };

  validateEmail = email => {
    return isEmail(email);
  };

  validateUsername = username => {
    const schema = new passwordValidator();
    schema
      .is()
      .min(6)
      .is()
      .max(32)
      .has()
      .not()
      .spaces();
    return schema.validate(username);
  };

  validatePassword = (password, repassword) => {
    const schema = new passwordValidator();
    schema
      .is()
      .min(8) // Minimum length 8
      .is()
      .max(32) // Maximum length 32
      .has()
      .uppercase() // Must have uppercase letters
      .has()
      .lowercase() // Must have lowercase letters
      .has()
      .digits() // Must have digits
      .has()
      .not()
      .spaces();

    return schema.validate(password) && password === repassword;
  };
  createAccount = ({ username, email, password, repassword }) => {
    if (!this.validate(username, email, password, repassword)) return;
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    fetch("api/auth/create", { method: "POST", body: formData })
      .then(res => {
        if (res.status !== 200) return res.json();
        this.setState((state, props) => ({
          error: {
            visible: true,
            title: "Couldn't create account",
            message: "Account couldn't be created!"
          }
        }));
        throw new Error("Account couldn't be created!");
      })
      .then(data => {
        this.props.dispatch(setToken(data.token));
      })
      .catch(er => console.log(er));
  };

  loginMode = mode => {
    this.setState({ login: mode });
  };

  loginSubmit = ({ username, password }) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    fetch("api/auth/login", { method: "POST", body: formData })
      .then(res => {
        if (res.status === 200) return res.json();
        this.setState((state, props) => ({
          error: {
            visible: true,
            title: "Couldn't login",
            message: "Login failed!"
          }
        }));
        throw new Error("Login failed!");
      })
      .then(data => {
        this.props.dispatch(setToken(data.token));
      })
      .catch(er => console.log(er));
  };

  render() {
    return (
      <div>
        <div className=""></div>
        {this.state.error.visible && (
          <ErrorContainer
            errorTitle={this.state.error.title}
            errorMessage={this.state.error.message}
            onOk={this.clearError}
          />
        )}
        <div className="container">
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
          {this.state.login ? (
            <LogIn submitLogIn={this.loginSubmit} />
          ) : (
            <CreateAccount createAccount={this.createAccount} />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ token: state.token });

export default connect(mapStateToProps)(LogInPage);
