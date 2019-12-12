import React from "react";
import Tag from "./Tag.js";

const TagBar = props => (
  <div className="tagBar">
    {props.tags.map(tag => (
      <Tag key={index} Title={tag.title} />
    ))}
  </div>
);

export default TagBar;
