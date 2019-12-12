import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts } from "../actions/user";
class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    };
    this.GetPosts=this.GetPosts.bind(this);
  }

  componentDidMount(){
    this.GetPosts(this.props.user.username);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.user.username !== this.props.user.username) {
      this.GetPosts(nextProps.user.username);
      return true;
    }

    if (nextProps.user.posts.length !== this.props.user.posts.length)
      return true;
    return false;
  }

  GetPosts(username) {
    if(username==="")return;
    fetch("/api/post/createdby/" + username, { method: "GET" })
      .then(res => res.json())
      .then(data => {
        this.props.dispatch(setPosts(data));
      })
      .catch(er => console.log(er));
  }

  render() {
    return (
      <div>
        <PostList posts={this.props.user.posts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({ user: state.user });
export default connect(mapStateToProps)(ProfilePage);