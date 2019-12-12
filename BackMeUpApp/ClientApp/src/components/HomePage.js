import React, { Component } from "react";
import PostList from "./PostList";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };

    this.GetPosts = this.GetPosts.bind(this);

    this.GetPosts();
  }

  GetPosts() {
    fetch("api/post", { method: "GET" })
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
        <PostList posts={this.state.posts} />
      </div>
    );
  }
}

export default HomePage;
