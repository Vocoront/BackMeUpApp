import React, { Component } from "react";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setPosts, addPosts, incrementPage } from "../actions/posts";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import DropdownButton from "react-bootstrap/DropdownButton";
import store from "../reducers/tag";
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
      //sortBy: 2 //1-newest 2-popular 3-controversial
    };

    this.GetPosts = this.GetPosts.bind(this);
    //this.renderSortDropDown = this.renderSortDropDown.bind(this);
    this.sortByPopularity = this.sortByPopularity.bind(this);
    this.sortByNewest = this.sortByNewest.bind(this);
    this.sortByControversial = this.sortByControversial.bind(this);
    this.filterPosts = this.filterPosts.bind(this);
    this.resetPage = this.resetPage.bind(this);

    this.GetPosts();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.tag != prevProps.tag &&
      !(typeof this.props.tag == "undefined")
    ) {
      this.GetPosts();
    }
    if (this.props.filter != prevProps.filter) {
      //this.setState({ tmpPage: 0, nextPageBtnVisible: true });
      console.log("staro stanje " + this.state.tmpPage);
      this.resetPage();
      console.log("novo stanje " + this.state.tmpPage);
      //this.filterPosts();
    }
  }

  resetPage = () => {
    this.setState({ tmpPage: 0, nextPageBtnVisible: true }, () => {
      console.log("novoooo stanje " + this.state.tmpPage);
      this.filterPosts();
    });
  };

  GetPosts() {
    getPosts();
    this.props.dispatch(incrementPage());
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
    this.GetPosts();
  }

  sortByPopularity() {
    this.setState({ sortBy: 2, tmpPage: 0 });
    console.log("izmenjeno");
    // let sortedPosts = this.props.posts;
    // sortedPosts.sort((a, b) => {
    //   let sumaA = a.commentNo + a.agreeNo + a.disagreeNo;
    //   let sumaB = b.commentNo + b.agreeNo + b.disagreeNo;
    //   if (sumaA > sumaB) {
    //     return -1;
    //   }
    //   if (sumaB > sumaA) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // this.setState({ posts: this.props.posts });
  }
  sortByNewest() {
    this.setState({ sortBy: 1, tmpPage: 0 });
    // let sortedPosts = this.props.posts;
    // sortedPosts.sort((a, b) => {
    //   if (a.createdAt > b.createdAt) {
    //     return -1;
    //   }
    //   if (b.createdAt > a.createdAt) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // this.setState({ posts: this.props.posts });
  }

  sortByControversial() {
    this.setState({ sortBy: 3, tmpPage: 0 });
    // let sortedPosts = this.props.posts;
    // sortedPosts.sort((a, b) => {
    //   if (a.disagreeNo > b.disagreeNo) {
    //     return -1;
    //   }
    //   if (b.disagreeNo > a.disagreeNo) {
    //     return 1;
    //   }
    //   return 0;
    // });
    // this.setState({ posts: this.props.posts });
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
        <Fillter />

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
            <i className="fas fa-plus"></i>
          </Button>
        ) : (
          <i className="far fa-times-circle"></i>
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
