import React, { Component } from "react";
import { connect } from "react-redux";
import PostList from "./PostList";
import Fillter from "./Fillter";
import { getPosts } from "../services/postObtaining";
import { setCreator } from "../actions/filter";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.GetPosts = this.GetPosts.bind(this);
    this.GetPosts();
  }

  componentDidMount() {
    this.props.dispatch(setCreator());
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      this.GetPosts();
    }
    if (this.props.tag !== prevProps.tag) {
      this.GetPosts();
    }
  }

  GetPosts(nextPage = false) {
    getPosts(nextPage);
  }

  render() {
    return (
      <div>
        <Fillter />
        <PostList />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.posts,
  token: state.user.token,
  username: state.user.username,
  tag: state.filter.tag
});

export default connect(mapStateToProps)(HomePage);
