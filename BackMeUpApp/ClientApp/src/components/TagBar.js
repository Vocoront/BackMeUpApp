import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
import Tag from "./Tag.js";
import { returnStatement } from "@babel/types";
class TagBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.nacrtaj.bind(this);
  }

  nacrtaj() {
    this.props.tags.map(tag => {
      console.log("aaa");
      return <Tag />;
    });
  }

  render() {
    console.log(this.props.tags);

    return (
      <div className="tagBar">
        {this.props.tags.map(tag => {
          console.log("aaa");
          return <Tag />;
        })}
      </div>
    );
  }
}

export default TagBar;
