import React, { Component } from "react";
import { AwesomeButton } from "react-awesome-button";
//import AwesomeButtonStyles from "react-awesome-button/src/styles/styles.scss";

class Tag extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("bb");

    return <div className="tag">{this.props.Title}</div>;
  }
}

export default Tag;
