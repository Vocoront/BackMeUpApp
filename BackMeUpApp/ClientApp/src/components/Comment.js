import React from "react";
import { ConvertUtcToLocal } from "../util/ConvertUtcToLocal";
const Comment = props => (
  <div className="OneComment">
    <div>
      <p>{props.username}</p>
      <p>{ConvertUtcToLocal(props.createdAt)}</p>
    </div>

    <p>{props.text}</p>
  </div>
);

export default Comment;
