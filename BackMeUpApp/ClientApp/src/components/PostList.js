import React from "react";
import Post from './Post';
const PostList = props => (
  <div>
    {props.posts.map((post, index) => (
      <Post
        key={index}
        title={post.title}
        creator={post.username}
        content={post.text}
        postId={post.id}
        tags={post.tags}
        createdAt={post.createdAt}
        choice={post.choice}
      />
    ))}
  </div>
);

export default PostList;
