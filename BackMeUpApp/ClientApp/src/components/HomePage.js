import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts } from "../actions/posts";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import store from "../reducers/tag";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      tag: this.props.tag
    };

    this.GetPosts = this.GetPosts.bind(this);
    this.renderSortDropDown = this.renderSortDropDown.bind(this);
    this.sortByPopularity = this.sortByPopularity.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
    this.sortByControversial = this.sortByControversial.bind(this);

    this.GetPosts();
  }

  GetPosts() {
    console.log(this.props.tag + "aaaaaaaaa");
    if (this.props.tag === "") {
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
      fetch("/api/post/getPostByTag/" + this.props.tag.tag, {
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

  sortByPopularity() {
    let sortedPosts = this.props.posts;
    sortedPosts.sort((a, b) => {
      let sumaA = a.commentNo + a.agreeNo + a.disagreeNo;
      let sumaB = b.commentNo + b.agreeNo + b.disagreeNo;
      if (sumaA > sumaB) {
        return -1;
      }
      if (sumaB > sumaA) {
        return 1;
      }
      return 0;
    });
    this.setState({ posts: this.props.posts });
  }
  sortByNewest() {
    let sortedPosts = this.props.posts;
    sortedPosts.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (b.createdAt > a.createdAt) {
        return 1;
      }
      return 0;
    });
    this.setState({ posts: this.props.posts });
  }

  sortByControversial() {
    let sortedPosts = this.props.posts;
    sortedPosts.sort((a, b) => {
      if (a.disagreeNo > b.disagreeNo) {
        return -1;
      }
      if (b.disagreeNo > a.disagreeNo) {
        return 1;
      }
      return 0;
    });
    this.setState({ posts: this.props.posts });
  }

  renderSortDropDown() {
    return (
      <Dropdown size="lg">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Sort
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={this.sortByPopularity}>
            Most popular
          </Dropdown.Item>
          <Dropdown.Item onClick={this.sortByNewest}>Newest</Dropdown.Item>
          <Dropdown.Item onClick={this.sortByControversial}>
            Controversial
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
  render() {
    return (
      <div
        className="HomePageContent"
        onClick={() => {
          console.log(this.props.tag);
        }}
      >
        {/* <div className="sortButtonDiv">{this.renderSortDropDown()}</div> */}
        <PostList posts={this.props.posts} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.posts,
  token: state.user.token,
  tag: state.tag.tag
});

export default connect(mapStateToProps)(HomePage);
