import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts } from "../actions/posts";
import { addPosts } from "../actions/posts";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import store from "../reducers/tag";
import Button from "react-bootstrap/Button";

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
    this.renderSortDropDown = this.renderSortDropDown.bind(this);
    this.sortByPopularity = this.sortByPopularity.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
    this.sortByControversial = this.sortByControversial.bind(this);
    this.filterPosts = this.filterPosts.bind(this);

    this.GetPosts();
  }

  componentDidUpdate(prevProps) {
    if (typeof this.props.tag == "undefined") console.log("jebem ti mater");

    if (
      this.props.tag != prevProps.tag &&
      !(typeof this.props.tag == "undefined")
    ) {
      console.log("ponovo uzima");
      this.GetPosts();
    }
    if (this.props.filter != prevProps.filter) {
      console.log("filter u home");
      this.filterPosts();
    }
  }

  GetPosts() {
    console.log(this.props.tag + " je tag");
    if (this.props.tag === "" || !this.props.tag) {
      fetch("api/post/getFrom/" + this.state.tmpPage, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + this.props.token
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log("preuzeto postova: " + Object.keys(data).length);
          if (this.state.tmpPage == 0) {
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
    if (this.props.filter === "Newest") {
      console.log("newest filter");
      this.sortByNewest();
    } else {
      if (this.props.filter === "Controversial") {
        this.sortByControversial();
      } else {
        if (this.props.filter === "MostPopular") {
          this.sortByPopularity();
        }
      }
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
          console.log(
            "tag je:" + this.props.tag + "  filter je:" + this.props.filter
          );
        }}
      >
        {/* <div className="sortButtonDiv">{this.renderSortDropDown()}</div> */}
        <PostList posts={this.props.posts} />
        {this.state.nextPageBtnVisible ? (
          <Button
            variant="outline-secondary"
            onClick={() => {
              console.log(this.state.tmpPage);
              this.GetPosts();
            }}
          >
            <i class="fas fa-plus"></i>
          </Button>
        ) : (
          <i class="far fa-times-circle"></i>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts.posts,
  token: state.user.token,
  tag: state.tag.tag,
  filter: state.tag.filter
});

export default connect(mapStateToProps)(HomePage);
