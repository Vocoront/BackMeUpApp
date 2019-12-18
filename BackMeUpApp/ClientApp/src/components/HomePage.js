import React, { Component } from "react";
import PostList from "./PostList";
import {connect} from "react-redux";
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
      fetch("api/post", { method: "GET" ,
      headers: {
        Authorization: "Bearer " + this.props.token
      }
    })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState((state, props) => ({ posts: data }));
        })
        .catch(er => console.log(er));
    } else {
      fetch("/api/post/getPostByTag/" + this.state.tag, { method: "GET" })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.setState((state, props) => ({ posts: data }));
        })
        .catch(er => console.log(er));
    }
  }

  render() {
    return (
      <div>
        <PostList posts={this.state.posts} />
      </div>
    );
  }
}


const mapStateToProps=(state)=>({
  token:state.user.token
});

export default connect(mapStateToProps)(HomePage);
