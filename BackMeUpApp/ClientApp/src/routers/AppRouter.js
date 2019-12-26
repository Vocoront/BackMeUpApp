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
import { Connect } from "../actions/notification";
import authHeader from "../helpers/authHeader";
import NotificationContainer from "../components/NotificationContainer";
class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subs: []
    };

    this.reconnect = this.reconnect.bind(this);
  }

  componentDidMount() {
    this.reconnect();
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
          this.props.dispatch(Connect());
        })
        .catch(er => console.log(er));
    }
  };

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div className="page-content-layout">
            <div className="page-content-layout__sidebar">
              <NotificationContainer />
            </div>
            <div className="page-content-layout__main">
              <Switch>
                <Route exact={true} path="/" component={HomePage} />
                <Route path="/createpost" component={CreatePostPage} />
                <Route path="/profile" component={ProfilePage} />
                <Route path="/login" component={LogInPage} />
                <Route path="/extendedPost/:id" component={ExtendedPost} />
                <Route component={NotFoundPage} />
              </Switch>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
const mapStateToProps = state => ({
  connection: state.notification.connection,
  connectionId: state.notification.connectionId
});

export default connect(mapStateToProps)(AppRouter);
