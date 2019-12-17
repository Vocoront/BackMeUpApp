import React from "react";
import moment from "moment";

const Comment = props => (
  <div className="OneComment">
    <p>{props.username}</p>
    <p>{props.text}</p>
    <p>
      {moment
        .utc(props.createdAt)
        .local()
        .format("YYYY-MMM-DD h:mm A")}
    </p>
  </div>
);

export default Comment;
