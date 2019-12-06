import React, { Component } from "react";
import Post from "./Post";
import { connect } from "react-redux";
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };

    this.GetPosts();

    this.GetPosts.bind(this);
  }

  GetPosts() {
    fetch("/api/post/createdby/" + this.props.user.username, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState((state, props) => ({ posts: data }));
      })
      .catch(er => console.log(er));
  }

  render() {
    return (
      <div>
        <div>
          {this.state.posts.map((post, index) => {
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
