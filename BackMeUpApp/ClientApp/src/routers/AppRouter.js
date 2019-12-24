import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "../components/HomePage";
import ProfilePage from "../components/ProfilePage";
import NotFoundPage from "../components/error-page/NotFoundPage";
import Header from "../components/Header";
import LogInPage from "../components/login-page/LogInPage";
import CreatePostPage from "../components/create-post-page/CreatePostPage";
import ExtendedPost from "../components/ExtendedPost";
import { setUsername, deleteToken } from "../actions/user";
import { Connect, GetSubscriptions } from "../actions/notification";
import authHeader from "../helpers/authHeader";

class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subs: []
    };

    this.reconnect = this.reconnect.bind(this);
    this.getSubs = this.getSubs.bind(this);
  }
  getSubs() {
    const token = authHeader();
    fetch("api/user/follows", {
      method: "GET",
      headers: {
        ...token
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ subs: data });
        setTimeout(() => {
          this.props.connection.invoke(
            "SendMessage",
            "username",
            this.state.message
          );
          this.props.connection.invoke("AddGroups", data);
        }, 2000);
      })
      .catch(er => console.log(er));
  }

  componentDidMount() {
    this.reconnect();
    this.props.dispatch(Connect());
    this.getSubs();
  }

  reconnect = () => {
    const token = authHeader();
    if (token) {
      fetch("api/user/reconnect", {
        method: "POST",
        headers: {
          ...token
        }
      })
        .then(res => {
          if (res.status === 200) return res.json();
          this.props.dispatch(deleteToken());
        })
        .then(data => {
          this.props.dispatch(setUsername(data.username));
        })
        .catch(er => console.log(er));
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Switch>
            <Route exact={true} path="/" component={HomePage} />
            <Route path="/createpost" component={CreatePostPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route path="/login" component={LogInPage} />
            <Route path="/extendedPost/:id" component={ExtendedPost} />
            <Route component={NotFoundPage} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  connection: state.notification.connection
});

export default connect(mapStateToProps)(AppRouter);
