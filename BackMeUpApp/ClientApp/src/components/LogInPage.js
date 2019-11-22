import React, { Component } from "react";
import LogIn from './LogIn';
class LogInPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true
    };
    this.loginMode.bind(this);
    this.loginSubmit.bind(this);
  }

  loginMode=(mode)=>{
      this.setState({login:mode});
  }


  loginSubmit=()=>{
    fetch("api/user/me")
    .then(res=>res.json())
    .then(data=>console.log(data))
    .catch(er=>console.log(er));
  }

  render() {
    return (
      <div className="container">
        <div className="login--option-container">
          <div onClick={()=>this.loginMode(true)}
            className={
              (this.state.login && "login--option login--option__selected") ||
              "login--option "
            }
          >
            Log In
          </div>
          <div onClick={()=>this.loginMode(false)}
            className={
              (this.state.login && "login--option") ||
              "login--option  login--option__selected"
            }
          >
            Create Account
          </div>
        </div>
        {
          this.state.login&&   <LogIn submitLogIn={this.loginSubmit}/>
        }
     
      </div>
    );
  }
}

export default LogInPage;
