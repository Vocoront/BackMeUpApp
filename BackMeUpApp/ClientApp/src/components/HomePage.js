import React, { Component } from "react";
import Post from "./Post";
import Message from './Message';
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };

    this.GetPosts();

    this.GetPosts.bind(this);
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
    {
      console.log(this.posts);
    }
    return (
      <div>
        <Message/>
        <div>
          {this.state.posts.map((post, index) => {
            return (
              <Post
                key={index}
                title={post.title}
                creator={post.username}
                content={post.text}
                postId={post.id}
                tags={post.tags}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default HomePage;
