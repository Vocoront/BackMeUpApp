import React from "react";
import moment from "moment";

const Comment = props => (
  <div className="OneComment">
    <div>
      <p>{props.username}</p>
      <p>
        {moment
          .utc(props.createdAt)
          .local()
          .format("YYYY-MMM-DD h:mm A")}
      </p>
    </div>

    <p>{props.text}</p>
  </div>
);

export default Comment;
