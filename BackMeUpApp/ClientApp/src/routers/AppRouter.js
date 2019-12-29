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
import NotificationContainer from "../components/NotificationContainer";
import Alert from "../components/Alert";
import { reconnect } from "../services/userAuth";
class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subs: []
    };
  }
  componentDidMount() {
    reconnect();
  }

  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <div className="page-content-layout">
            <div className="page-content-layout__sidebar">
              {this.props.user.username && <NotificationContainer />}
            </div>
            <div className="page-content-layout__main">
              {this.props.showAlert && <Alert />}
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
  showAlert: state.alert.visible,
  user: state.user
});

export default connect(mapStateToProps)(AppRouter);
