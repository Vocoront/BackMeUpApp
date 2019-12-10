import React, { Component } from "react";
import Post from "./Post";
import { connect } from "react-redux";
import { setPosts } from "../actions/user";
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };

    this.GetPosts.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.user.username !== this.props.user.username) return true;

    if (nextProps.user.posts.length !== this.props.user.posts.length)
      return true;
    return false;
  }

  GetPosts() {
    fetch("/api/post/createdby/" + this.props.user.username, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        this.props.dispatch(setPosts(data));
      })
      .catch(er => console.log(er));
  }

  render() {
    this.GetPosts();
    return (
      <div>
        <div>
          {this.props.user.posts.map((post, index) => {
            return (
              <Post
                key={index}
                title={post.title}
                creator={post.username}
                content={post.text}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(ProfilePage);
