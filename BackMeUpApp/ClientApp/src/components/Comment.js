import React from "react";

const Comment = props => (
  <div className="OneComment">
    <p>{props.username}</p>
    <p>{props.text}</p>
  </div>
);

export default Comment;
