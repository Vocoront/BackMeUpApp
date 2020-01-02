import React from "react";
import { connect } from "react-redux";
import Button from "react-bootstrap/Button";
import Post from "./Post";
import { getPosts } from "../services/postObtaining";
import { incrementPage } from "../actions/posts";

const PostList = props => (
  <div className="post-list">
    <div>
      {props.posts.map((post, index) => (
        <Post
          key={index}
          title={post.title}
          creator={post.creator}
          content={post.text}
          postId={post.id}
          tags={post.tags}
          createdAt={post.createdAt}
          choice={post.choice}
          imageUrls={post.imageUrls}
          commentNo={post.commentNo}
          agreeNo={post.agreeNo}
          disagreeNo={post.disagreeNo}
          follow={post.follow}
        />
      ))}
    </div>
    {props.postsLoading ? (
      <div className="loader">Loading...</div>
    ) : (
      <Button
        variant="outline-secondary"
        onClick={() => {
          props.dispatch(incrementPage());
          getPosts(true);
        }}
      >
        <i className="fas fa-plus"></i>
      </Button>
    )}
  </div>
);

const mapStateToProps = state => ({
  posts: state.posts.posts,
  postsLoading: state.posts.loading
});

export default connect(mapStateToProps)(PostList);
