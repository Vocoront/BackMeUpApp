import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts } from "../actions/posts";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      tag: ""
    };

    this.GetPosts = this.GetPosts.bind(this);

    this.GetPosts();
  }

  GetPosts() {
    if (this.state.tag === "") {
      fetch("api/post", {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.props.token
        }
      })
        .then(res => res.json())
        .then(data => {
          this.props.dispatch(setPosts(data));
        })
        .catch(er => console.log(er));
    } else {
      fetch("/api/post/getPostByTag/" + this.state.tag, { method: "GET" })
        .then(res => res.json())
        .then(data => {
          this.setState((state, props) => ({ posts: data }));
        })
        .catch(er => console.log(er));
    }
  }

  render() {
    return (
      <div>
        <PostList posts={this.props.posts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.posts,
  token: state.user.token
});

export default connect(mapStateToProps)(HomePage);
