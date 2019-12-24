import React from "react";
import { convertUtcToLocal } from "../helpers/convertUtcToLocal";
const Comment = props => (
  <div className="OneComment">
    <div>
      <p>{props.username}</p>
      <p>{convertUtcToLocal(props.createdAt)}</p>
    </div>
    <p>{props.text}</p>
  </div>
);
export default Comment;
