import React, { Component } from "react";
import { connect } from "react-redux";
import PostList from "./PostList";
import Fillter from "./Fillter";
import { getPosts } from "../services/postObtaining";
import { setCreator, setTag } from "../actions/filter";
import { setBackHistory } from "../actions/posts";
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.GetPosts = this.GetPosts.bind(this);
    if (props.stopLoading && props.posts.length !== 0) {
      props.dispatch(setBackHistory());
    } else {
      this.GetPosts();
    }
  }

  componentDidMount() {
    if (this.props.match.params.username)
      this.props.dispatch(setCreator(this.props.match.params.username));
    else this.props.dispatch(setCreator());
    if (this.props.match.params.tag)
      this.props.dispatch(setTag(this.props.match.params.tag));
    else this.props.dispatch(setTag());
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.username !== prevProps.match.params.username) {
      this.props.dispatch(setCreator(this.props.match.params.username));
      this.GetPosts();
    }
    if (this.props.match.params.tag !== prevProps.match.params.tag) {
      this.props.dispatch(setTag(this.props.match.params.tag));
      this.GetPosts();
    }

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
  stopLoading: state.posts.backHistory,
  token: state.user.token,
  username: state.user.username,
  tag: state.filter.tag
});

export default connect(mapStateToProps)(HomePage);
