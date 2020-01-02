import React, { Component } from "react";
import PostList from "./PostList";
import Fillter from "./Fillter";
import { connect } from "react-redux";
import { setCreator } from "../actions/filter";
import { getPosts } from "../services/postObtaining";

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.GetPosts = this.GetPosts.bind(this);
    this.GetPosts();
  }
  GetPosts(nextPage = false) {
    this.props.dispatch(setCreator(this.props.user.username));
    getPosts(nextPage);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.user.username !== this.props.user.username) {
      this.props.dispatch(setCreator(nextProps.user.username));

      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        <Fillter />
        <PostList posts={this.props.user.posts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(ProfilePage);
