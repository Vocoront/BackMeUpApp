import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts, addPosts, incrementPage } from "../actions/posts";
import Button from "react-bootstrap/Button";
import Fillter from "./Fillter";
import { getPosts } from "../services/postObtaining";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      tag: this.props.tag,
      tmpPage: 0,
      nextPageBtnVisible: true
    };

    this.GetPosts = this.GetPosts.bind(this);

    this.filterPosts = this.filterPosts.bind(this);
    this.resetPage = this.resetPage.bind(this);

    this.GetPosts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.username !== prevProps.username) {
      this.GetPosts();
    }
    if (
      this.props.tag !== prevProps.tag &&
      !(typeof this.props.tag === "undefined")
    ) {
      this.GetPosts();
    }
    if (this.props.filter !== prevProps.filter) {
      console.log("staro stanje " + this.state.tmpPage);
      this.resetPage();
      console.log("novo stanje " + this.state.tmpPage);
    }
  }

  resetPage = () => {
    this.setState({ tmpPage: 0, nextPageBtnVisible: true }, () => {
      console.log("novoooo stanje " + this.state.tmpPage);
      this.filterPosts();
    });
  };

  GetPosts(nextPage = false) {
    getPosts(nextPage);
  }
  GetPosts1() {
    console.log(
      "sort je: " + this.props.filter + " tmpstrana: " + this.state.tmpPage
    );
    if (this.props.tag === "" || !this.props.tag) {
      fetch(
        "api/post/getFrom/" + this.state.tmpPage + "/" + this.props.filter,
        {
          method: "GET",
          headers: {
            Authorization: "Bearer " + this.props.token
          }
        }
      )
        .then(res => res.json())
        .then(data => {
          console.log("preuzeto postova: " + Object.keys(data).length);
          console.log(data);
          if (this.state.tmpPage === 0) {
            this.props.dispatch(setPosts(data));
            this.setState({ tmpPage: this.state.tmpPage + 1 });
          } else {
            if (Object.keys(data).length > 0) {
              this.props.dispatch(addPosts(data));
              this.setState({ tmpPage: this.state.tmpPage + 1 });
            } else {
              this.setState({ nextPageBtnVisible: false });
            }
          }
        })
        .catch(er => console.log(er));
    } else {
      fetch("/api/post/getPostByTag/" + this.props.tag, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.props.token
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          this.props.dispatch(setPosts(data));
        })
        .catch(er => console.log(er));
    }
  }

  filterPosts() {
    // this.GetPosts();
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
  tag: state.tag.tag,
  filter: state.tag.filter
});

export default connect(mapStateToProps)(HomePage);
