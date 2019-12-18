import React from "react";
import { connect } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomePage from "../components/HomePage";
import ProfilePage from "../components/ProfilePage";
import NotFoundPage from "../components/error-page/NotFoundPage";
import Header from "../components/Header";
import LogInPage from "../components/login-page/LogInPage";
import CreatePostPage from "../components/create-post-page/CreatePostPage";
import ExtendedPost from "../components/ExtendedPost";
import {setUsername, deleteToken} from '../actions/user';


const AppRouter = props => {
  if (props.token) {
    fetch("api/user/reconnect", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + props.token
      }
    })
      .then(res => {
        if (res.status === 200) return res.json();
        props.dispatch(deleteToken());
      })
      .then(data => {
        props.dispatch(setUsername(data.username));
      })
      .catch(er => console.log(er));
  }

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
};

const mapStateToProps = state => ({ token: state.user.token });

export default connect(mapStateToProps)(AppRouter);
