import React from "react";
import Post from "./Post";
const PostList = props => (
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
);

export default PostList;
